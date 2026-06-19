-- ============ STAMMDATEN: PAKETE & MODULE ============
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  setup_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  default_term_months INTEGER NOT NULL DEFAULT 12,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.package_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  setup_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  default_term_months INTEGER NOT NULL DEFAULT 12,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ VERTRÄGE ============
CREATE TYPE public.contract_status AS ENUM ('aktiv','pausiert','gekuendigt','beendet');
CREATE TYPE public.billing_cycle AS ENUM ('monatlich','quartal','jaehrlich');
CREATE TYPE public.contract_item_kind AS ENUM ('package','module');

CREATE TABLE public.customer_contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  start_date DATE,
  end_date DATE,
  billing_cycle public.billing_cycle NOT NULL DEFAULT 'monatlich',
  status public.contract_status NOT NULL DEFAULT 'aktiv',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.contract_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.customer_contracts(id) ON DELETE CASCADE,
  kind public.contract_item_kind NOT NULL,
  package_id UUID REFERENCES public.packages(id) ON DELETE SET NULL,
  module_id UUID REFERENCES public.package_modules(id) ON DELETE SET NULL,
  label TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  setup_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  term_months INTEGER NOT NULL DEFAULT 12,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ SEPA ============
CREATE TYPE public.sepa_status AS ENUM ('offen','signiert','widerrufen');

CREATE TABLE public.sepa_mandates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  mandate_reference TEXT,
  status public.sepa_status NOT NULL DEFAULT 'offen',
  account_holder TEXT,
  iban TEXT,
  bic TEXT,
  signed_at TIMESTAMPTZ,
  signed_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sepa_mandates_customer ON public.sepa_mandates(customer_id);

-- ============ NOTIZEN ============
CREATE TABLE public.customer_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  author_id UUID,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_customer_notes_customer ON public.customer_notes(customer_id);

-- ============ TERMINE ============
CREATE TYPE public.appointment_status AS ENUM ('geplant','erledigt','abgesagt');
CREATE TYPE public.appointment_recurrence AS ENUM ('keine','woechentlich','zweiwoechentlich','monatlich','quartal','jaehrlich');

CREATE TABLE public.customer_appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  recurrence public.appointment_recurrence NOT NULL DEFAULT 'keine',
  status public.appointment_status NOT NULL DEFAULT 'geplant',
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_customer_appointments_customer ON public.customer_appointments(customer_id);
CREATE INDEX idx_customer_appointments_starts ON public.customer_appointments(starts_at);

-- ============ RECHNUNGEN ============
CREATE TYPE public.invoice_status AS ENUM ('entwurf','versendet','bezahlt','storniert');

CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE,
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  period_start DATE,
  period_end DATE,
  subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
  tax_rate NUMERIC(5,2) NOT NULL DEFAULT 19,
  tax_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  status public.invoice_status NOT NULL DEFAULT 'entwurf',
  pdf_url TEXT,
  moco_invoice_id TEXT,
  moco_synced_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_invoices_customer ON public.invoices(customer_id);

CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL DEFAULT 0,
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ RLS ============
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contract_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sepa_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Authenticated full access (analog zu bestehenden Tabellen)
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['packages','package_modules','customer_contracts','contract_items','sepa_mandates','customer_notes','customer_appointments','invoices','invoice_items']
  LOOP
    EXECUTE format('CREATE POLICY "auth select %1$s" ON public.%1$I FOR SELECT TO authenticated USING (true);', t);
    EXECUTE format('CREATE POLICY "auth insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (true);', t);
    EXECUTE format('CREATE POLICY "auth update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (true);', t);
    EXECUTE format('CREATE POLICY "auth delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (true);', t);
  END LOOP;
END $$;

-- ============ Trigger updated_at ============
DO $$
DECLARE t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['packages','package_modules','customer_contracts','contract_items','sepa_mandates','customer_notes','customer_appointments','invoices']
  LOOP
    EXECUTE format('CREATE TRIGGER trg_updated_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();', t);
  END LOOP;
END $$;

-- ============ Public RPCs für SEPA (Token-basiert) ============
CREATE OR REPLACE FUNCTION public.get_sepa_mandate_by_token(_token TEXT)
RETURNS TABLE (
  id UUID,
  customer_id UUID,
  company_name TEXT,
  status public.sepa_status,
  account_holder TEXT,
  iban TEXT,
  bic TEXT,
  mandate_reference TEXT,
  signed_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT m.id, m.customer_id, c.company_name, m.status, m.account_holder, m.iban, m.bic, m.mandate_reference, m.signed_at
  FROM public.sepa_mandates m
  JOIN public.customers c ON c.id = m.customer_id
  WHERE m.token = _token
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.sign_sepa_mandate(
  _token TEXT,
  _account_holder TEXT,
  _iban TEXT,
  _bic TEXT,
  _ip TEXT
) RETURNS public.sepa_mandates
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.sepa_mandates;
BEGIN
  UPDATE public.sepa_mandates
  SET account_holder = _account_holder,
      iban = upper(regexp_replace(_iban, '\s+', '', 'g')),
      bic = upper(regexp_replace(coalesce(_bic,''), '\s+', '', 'g')),
      signed_at = now(),
      signed_ip = _ip,
      status = 'signiert',
      updated_at = now()
  WHERE token = _token AND status = 'offen'
  RETURNING * INTO _row;

  IF _row.id IS NULL THEN
    RAISE EXCEPTION 'Mandat nicht gefunden oder bereits signiert';
  END IF;
  RETURN _row;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_sepa_mandate_by_token(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.sign_sepa_mandate(TEXT,TEXT,TEXT,TEXT,TEXT) TO anon, authenticated;