
-- 1) Staff helper
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','kundenbetreuer'))
$$;

REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;

-- 2) Replace permissive policies with staff-only on sensitive tables
-- customers
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;
CREATE POLICY "staff select customers" ON public.customers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert customers" ON public.customers FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update customers" ON public.customers FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "admins delete customers" ON public.customers FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::app_role));

-- customer_api_keys
DROP POLICY IF EXISTS "Authenticated users can view api keys" ON public.customer_api_keys;
DROP POLICY IF EXISTS "Authenticated users can insert api keys" ON public.customer_api_keys;
DROP POLICY IF EXISTS "Authenticated users can update api keys" ON public.customer_api_keys;
DROP POLICY IF EXISTS "Authenticated users can delete api keys" ON public.customer_api_keys;
CREATE POLICY "admins select api keys" ON public.customer_api_keys FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins insert api keys" ON public.customer_api_keys FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins update api keys" ON public.customer_api_keys FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role)) WITH CHECK (public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "admins delete api keys" ON public.customer_api_keys FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));

-- invoices
DROP POLICY IF EXISTS "auth select invoices" ON public.invoices;
DROP POLICY IF EXISTS "auth insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "auth update invoices" ON public.invoices;
DROP POLICY IF EXISTS "auth delete invoices" ON public.invoices;
CREATE POLICY "staff select invoices" ON public.invoices FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert invoices" ON public.invoices FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update invoices" ON public.invoices FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "admins delete invoices" ON public.invoices FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'::app_role));

-- invoice_items
DROP POLICY IF EXISTS "auth select invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "auth insert invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "auth update invoice_items" ON public.invoice_items;
DROP POLICY IF EXISTS "auth delete invoice_items" ON public.invoice_items;
CREATE POLICY "staff select invoice_items" ON public.invoice_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert invoice_items" ON public.invoice_items FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update invoice_items" ON public.invoice_items FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete invoice_items" ON public.invoice_items FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- customer_appointments
DROP POLICY IF EXISTS "auth select customer_appointments" ON public.customer_appointments;
DROP POLICY IF EXISTS "auth insert customer_appointments" ON public.customer_appointments;
DROP POLICY IF EXISTS "auth update customer_appointments" ON public.customer_appointments;
DROP POLICY IF EXISTS "auth delete customer_appointments" ON public.customer_appointments;
CREATE POLICY "staff select customer_appointments" ON public.customer_appointments FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert customer_appointments" ON public.customer_appointments FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update customer_appointments" ON public.customer_appointments FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete customer_appointments" ON public.customer_appointments FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- customer_contracts
DROP POLICY IF EXISTS "auth select customer_contracts" ON public.customer_contracts;
DROP POLICY IF EXISTS "auth insert customer_contracts" ON public.customer_contracts;
DROP POLICY IF EXISTS "auth update customer_contracts" ON public.customer_contracts;
DROP POLICY IF EXISTS "auth delete customer_contracts" ON public.customer_contracts;
CREATE POLICY "staff select customer_contracts" ON public.customer_contracts FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert customer_contracts" ON public.customer_contracts FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update customer_contracts" ON public.customer_contracts FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete customer_contracts" ON public.customer_contracts FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- contract_items
DROP POLICY IF EXISTS "auth select contract_items" ON public.contract_items;
DROP POLICY IF EXISTS "auth insert contract_items" ON public.contract_items;
DROP POLICY IF EXISTS "auth update contract_items" ON public.contract_items;
DROP POLICY IF EXISTS "auth delete contract_items" ON public.contract_items;
CREATE POLICY "staff select contract_items" ON public.contract_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert contract_items" ON public.contract_items FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update contract_items" ON public.contract_items FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete contract_items" ON public.contract_items FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- customer_notes
DROP POLICY IF EXISTS "auth select customer_notes" ON public.customer_notes;
DROP POLICY IF EXISTS "auth insert customer_notes" ON public.customer_notes;
DROP POLICY IF EXISTS "auth update customer_notes" ON public.customer_notes;
DROP POLICY IF EXISTS "auth delete customer_notes" ON public.customer_notes;
CREATE POLICY "staff select customer_notes" ON public.customer_notes FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert customer_notes" ON public.customer_notes FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update customer_notes" ON public.customer_notes FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete customer_notes" ON public.customer_notes FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- domains
DROP POLICY IF EXISTS "Authenticated users can view domains" ON public.domains;
DROP POLICY IF EXISTS "Authenticated users can insert domains" ON public.domains;
DROP POLICY IF EXISTS "Authenticated users can update domains" ON public.domains;
DROP POLICY IF EXISTS "Authenticated users can delete domains" ON public.domains;
CREATE POLICY "staff select domains" ON public.domains FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert domains" ON public.domains FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update domains" ON public.domains FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete domains" ON public.domains FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- sepa_mandates (token-based public signing remains via SECURITY DEFINER RPCs)
DROP POLICY IF EXISTS "auth select sepa_mandates" ON public.sepa_mandates;
DROP POLICY IF EXISTS "auth insert sepa_mandates" ON public.sepa_mandates;
DROP POLICY IF EXISTS "auth update sepa_mandates" ON public.sepa_mandates;
DROP POLICY IF EXISTS "auth delete sepa_mandates" ON public.sepa_mandates;
CREATE POLICY "staff select sepa_mandates" ON public.sepa_mandates FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff insert sepa_mandates" ON public.sepa_mandates FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff update sepa_mandates" ON public.sepa_mandates FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete sepa_mandates" ON public.sepa_mandates FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

-- mail_test_logs: own logs or admin
DROP POLICY IF EXISTS "Authenticated users can view mail test logs" ON public.mail_test_logs;
DROP POLICY IF EXISTS "Authenticated users can insert mail test logs" ON public.mail_test_logs;
CREATE POLICY "own or admin select mail_test_logs" ON public.mail_test_logs FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "own insert mail_test_logs" ON public.mail_test_logs FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND public.is_staff(auth.uid()));

-- profiles: self or admin
DROP POLICY IF EXISTS "auth view profiles" ON public.profiles;
CREATE POLICY "self or admin view profiles" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'::app_role));

-- 3) Storage: invoices bucket — restrict to staff
DROP POLICY IF EXISTS "Authenticated can read invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can upload invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can update invoices" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can delete invoices" ON storage.objects;
CREATE POLICY "staff read invoices" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'invoices' AND public.is_staff(auth.uid()));
CREATE POLICY "staff upload invoices" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'invoices' AND public.is_staff(auth.uid()));
CREATE POLICY "staff update invoices" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'invoices' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'invoices' AND public.is_staff(auth.uid()));
CREATE POLICY "admins delete invoices objects" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'invoices' AND public.has_role(auth.uid(),'admin'::app_role));

-- 4) Revoke EXECUTE on internal SECURITY DEFINER functions from anon/authenticated where not needed
-- Keep get_sepa_mandate_by_token & sign_sepa_mandate executable by anon (token-based public SEPA flow)
REVOKE ALL ON FUNCTION public.claim_domain_for_customer(text, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_domain_for_customer(text, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.reassign_domain_to_customer(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reassign_domain_to_customer(uuid, uuid) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.next_invoice_number() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.next_invoice_number() TO service_role;

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.generate_customer_code() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
