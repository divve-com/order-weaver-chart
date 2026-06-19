-- Drop all application tables, functions and types in public schema
DROP TABLE IF EXISTS public.contract_items CASCADE;
DROP TABLE IF EXISTS public.customer_contracts CASCADE;
DROP TABLE IF EXISTS public.customer_api_keys CASCADE;
DROP TABLE IF EXISTS public.customer_appointments CASCADE;
DROP TABLE IF EXISTS public.customer_notes CASCADE;
DROP TABLE IF EXISTS public.invoice_items CASCADE;
DROP TABLE IF EXISTS public.invoices CASCADE;
DROP TABLE IF EXISTS public.mail_test_logs CASCADE;
DROP TABLE IF EXISTS public.package_modules CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.sepa_mandates CASCADE;
DROP TABLE IF EXISTS public.domains CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.app_settings CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP SEQUENCE IF EXISTS public.invoice_number_seq CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, app_role) CASCADE;
DROP FUNCTION IF EXISTS public.is_staff(uuid) CASCADE;
DROP FUNCTION IF EXISTS public.get_sepa_mandate_by_token(text) CASCADE;
DROP FUNCTION IF EXISTS public.sign_sepa_mandate(text, text, text, text, text) CASCADE;
DROP FUNCTION IF EXISTS public.claim_domain_for_customer(text, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.reassign_domain_to_customer(uuid, uuid) CASCADE;
DROP FUNCTION IF EXISTS public.generate_customer_code() CASCADE;
DROP FUNCTION IF EXISTS public.next_invoice_number() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;

DROP TYPE IF EXISTS public.app_role CASCADE;
DROP TYPE IF EXISTS public.sepa_status CASCADE;