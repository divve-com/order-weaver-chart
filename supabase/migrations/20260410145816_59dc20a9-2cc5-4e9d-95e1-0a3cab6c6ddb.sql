CREATE TYPE public.domain_status AS ENUM ('pending_dns', 'dns_valid', 'dns_failed', 'subuser_active');

CREATE TABLE public.domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  domain TEXT NOT NULL,
  sendgrid_domain_id BIGINT,
  dns_records JSONB DEFAULT '[]'::jsonb,
  status domain_status NOT NULL DEFAULT 'pending_dns',
  subuser_name TEXT,
  subuser_api_key TEXT,
  branded_link_id BIGINT,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view domains"
  ON public.domains FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert domains"
  ON public.domains FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update domains"
  ON public.domains FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete domains"
  ON public.domains FOR DELETE TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_domains_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();