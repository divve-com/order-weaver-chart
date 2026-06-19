CREATE TYPE public.customer_status AS ENUM ('neu', 'vertrag', 'dns_setup', 'validierung', 'mail_test', 'aktiv', 'pausiert');

CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address_street TEXT,
  address_city TEXT,
  address_zip TEXT,
  address_country TEXT DEFAULT 'DE',
  industry TEXT,
  notes TEXT,
  contract_start DATE,
  contract_end DATE,
  contract_value NUMERIC(12,2),
  status customer_status NOT NULL DEFAULT 'neu',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view customers"
  ON public.customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert customers"
  ON public.customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update customers"
  ON public.customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete customers"
  ON public.customers FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Link domains to customers
ALTER TABLE public.domains ADD COLUMN customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL;
CREATE INDEX idx_domains_customer_id ON public.domains(customer_id);