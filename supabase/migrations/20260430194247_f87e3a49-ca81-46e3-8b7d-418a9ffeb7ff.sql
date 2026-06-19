-- 1) New columns on contract_items
ALTER TABLE public.contract_items
  ADD COLUMN IF NOT EXISTS billing_cycle public.billing_cycle NOT NULL DEFAULT 'monatlich',
  ADD COLUMN IF NOT EXISTS next_invoice_date date,
  ADD COLUMN IF NOT EXISTS last_invoiced_period_end date,
  ADD COLUMN IF NOT EXISTS parent_item_id uuid REFERENCES public.contract_items(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_contract_items_parent ON public.contract_items(parent_item_id);

-- 2) Backfill: copy contract dates + cycle onto package items
UPDATE public.contract_items ci
SET start_date = COALESCE(ci.start_date, cc.start_date),
    end_date   = COALESCE(ci.end_date, cc.end_date),
    billing_cycle = COALESCE(cc.billing_cycle, ci.billing_cycle),
    next_invoice_date = COALESCE(ci.next_invoice_date, cc.next_invoice_date, cc.start_date),
    last_invoiced_period_end = COALESCE(ci.last_invoiced_period_end, cc.last_invoiced_period_end)
FROM public.customer_contracts cc
WHERE ci.contract_id = cc.id
  AND ci.kind = 'package';

-- 3) Backfill modules: attach each module to the first package of its contract (best-effort)
WITH first_pkg AS (
  SELECT DISTINCT ON (contract_id) contract_id, id
  FROM public.contract_items
  WHERE kind = 'package'
  ORDER BY contract_id, created_at
)
UPDATE public.contract_items m
SET parent_item_id = fp.id
FROM first_pkg fp
WHERE m.kind = 'module'
  AND m.contract_id = fp.contract_id
  AND m.parent_item_id IS NULL;

-- 4) Drop now-unused columns from customer_contracts
ALTER TABLE public.customer_contracts
  DROP COLUMN IF EXISTS start_date,
  DROP COLUMN IF EXISTS end_date,
  DROP COLUMN IF EXISTS billing_cycle,
  DROP COLUMN IF EXISTS next_invoice_date,
  DROP COLUMN IF EXISTS last_invoiced_period_end;