-- Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS public.invoice_number_seq START 1;

CREATE OR REPLACE FUNCTION public.next_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n BIGINT;
  yr TEXT;
BEGIN
  n := nextval('public.invoice_number_seq');
  yr := to_char(now(), 'YYYY');
  RETURN 'RE-' || yr || '-' || lpad(n::TEXT, 4, '0');
END;
$$;

-- Storage bucket for invoice PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoices', 'invoices', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated can read invoices"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'invoices');

CREATE POLICY "Authenticated can upload invoices"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'invoices');

CREATE POLICY "Authenticated can update invoices"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'invoices');

CREATE POLICY "Authenticated can delete invoices"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'invoices');