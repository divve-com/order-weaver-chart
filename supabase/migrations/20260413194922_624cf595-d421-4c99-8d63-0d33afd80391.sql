CREATE TABLE public.mail_test_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain_id uuid REFERENCES public.domains(id) ON DELETE CASCADE NOT NULL,
  domain_name text NOT NULL,
  recipient text NOT NULL,
  subject text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  error_message text,
  sendgrid_status_code int,
  user_id uuid NOT NULL,
  user_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mail_test_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view mail test logs"
  ON public.mail_test_logs FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert mail test logs"
  ON public.mail_test_logs FOR INSERT TO authenticated WITH CHECK (true);