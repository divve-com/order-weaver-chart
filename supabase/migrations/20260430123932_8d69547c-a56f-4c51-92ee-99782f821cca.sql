ALTER TABLE public.domains
  ADD COLUMN IF NOT EXISTS foreign_subuser_username text;