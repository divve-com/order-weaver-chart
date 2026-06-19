-- Add subuser fields to customers
ALTER TABLE public.customers
  ADD COLUMN subuser_name text,
  ADD COLUMN subuser_api_key text,
  ADD COLUMN subuser_admin_api_key text,
  ADD COLUMN subuser_ip text;

-- Migrate existing data: for each customer, take subuser info from the first domain that has it
UPDATE public.customers c
SET
  subuser_name = d.subuser_name,
  subuser_api_key = d.subuser_api_key,
  subuser_admin_api_key = d.subuser_admin_api_key,
  subuser_ip = d.subuser_ip
FROM (
  SELECT DISTINCT ON (customer_id)
    customer_id, subuser_name, subuser_api_key, subuser_admin_api_key, subuser_ip
  FROM public.domains
  WHERE subuser_name IS NOT NULL AND customer_id IS NOT NULL
  ORDER BY customer_id, created_at ASC
) d
WHERE c.id = d.customer_id;

-- Remove subuser columns from domains
ALTER TABLE public.domains
  DROP COLUMN subuser_name,
  DROP COLUMN subuser_api_key,
  DROP COLUMN subuser_admin_api_key,
  DROP COLUMN subuser_ip;