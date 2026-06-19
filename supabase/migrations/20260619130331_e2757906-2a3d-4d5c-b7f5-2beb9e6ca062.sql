
-- Restrict orders and resources to authenticated users only
DROP POLICY IF EXISTS "Public can read orders" ON public.orders;
DROP POLICY IF EXISTS "Public can read resources" ON public.resources;

REVOKE SELECT ON public.orders FROM anon;
REVOKE SELECT ON public.resources FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.resources TO service_role;

CREATE POLICY "Authenticated users can read orders" ON public.orders
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can read resources" ON public.resources
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert resources" ON public.resources
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update resources" ON public.resources
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can delete resources" ON public.resources
  FOR DELETE TO authenticated USING (true);
