
CREATE TABLE public.customer_api_keys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  key_type TEXT NOT NULL CHECK (key_type IN ('admin', 'mail')),
  alias TEXT NOT NULL DEFAULT '',
  api_key TEXT NOT NULL,
  sendgrid_key_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.customer_api_keys ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view api keys" ON public.customer_api_keys FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert api keys" ON public.customer_api_keys FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update api keys" ON public.customer_api_keys FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete api keys" ON public.customer_api_keys FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_customer_api_keys_updated_at
BEFORE UPDATE ON public.customer_api_keys
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
