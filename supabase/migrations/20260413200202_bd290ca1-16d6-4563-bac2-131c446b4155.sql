CREATE TABLE public.app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view settings"
  ON public.app_settings FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert settings"
  ON public.app_settings FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update settings"
  ON public.app_settings FOR UPDATE TO authenticated USING (true);

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();