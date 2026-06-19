-- VAT on customer
ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS tax_rate numeric NOT NULL DEFAULT 19,
  ADD COLUMN IF NOT EXISTS vat_id text;

-- Recurring billing tracking on contract
ALTER TABLE public.customer_contracts
  ADD COLUMN IF NOT EXISTS next_invoice_date date,
  ADD COLUMN IF NOT EXISTS last_invoiced_period_end date;

-- Invoice kind
DO $$ BEGIN
  CREATE TYPE public.invoice_kind AS ENUM ('einrichtung','laufend');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.invoices
  ADD COLUMN IF NOT EXISTS kind public.invoice_kind NOT NULL DEFAULT 'laufend';