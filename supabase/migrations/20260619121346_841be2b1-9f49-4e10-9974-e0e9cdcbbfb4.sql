
-- Drop permissive write policies
DROP POLICY IF EXISTS "Public can insert resources" ON public.resources;
DROP POLICY IF EXISTS "Public can update resources" ON public.resources;
DROP POLICY IF EXISTS "Public can delete resources" ON public.resources;
DROP POLICY IF EXISTS "Public can insert orders"    ON public.orders;
DROP POLICY IF EXISTS "Public can update orders"    ON public.orders;
DROP POLICY IF EXISTS "Public can delete orders"    ON public.orders;

-- Revoke write privileges at the grant layer too
REVOKE INSERT, UPDATE, DELETE ON public.resources FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.orders    FROM anon, authenticated;
