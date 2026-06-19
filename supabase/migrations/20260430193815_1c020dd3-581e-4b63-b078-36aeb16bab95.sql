ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS invoice_title text,
  ADD COLUMN IF NOT EXISTS invoice_description text,
  ADD COLUMN IF NOT EXISTS setup_invoice_title text,
  ADD COLUMN IF NOT EXISTS setup_invoice_description text;

ALTER TABLE public.package_modules
  ADD COLUMN IF NOT EXISTS invoice_title text,
  ADD COLUMN IF NOT EXISTS invoice_description text,
  ADD COLUMN IF NOT EXISTS setup_invoice_title text,
  ADD COLUMN IF NOT EXISTS setup_invoice_description text;

ALTER TABLE public.contract_items
  ADD COLUMN IF NOT EXISTS invoice_title text,
  ADD COLUMN IF NOT EXISTS invoice_description text,
  ADD COLUMN IF NOT EXISTS setup_invoice_title text,
  ADD COLUMN IF NOT EXISTS setup_invoice_description text;