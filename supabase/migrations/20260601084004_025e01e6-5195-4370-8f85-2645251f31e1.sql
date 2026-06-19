CREATE UNIQUE INDEX IF NOT EXISTS domains_one_customer_per_domain
  ON public.domains (lower(domain))
  WHERE customer_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.claim_domain_for_customer(
  _domain text,
  _customer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.domains%ROWTYPE;
  _cust public.customers%ROWTYPE;
BEGIN
  IF _domain IS NULL OR length(trim(_domain)) = 0 THEN
    RAISE EXCEPTION 'domain required';
  END IF;
  IF _customer_id IS NULL THEN
    RAISE EXCEPTION 'customer_id required';
  END IF;

  SELECT * INTO _row
  FROM public.domains
  WHERE lower(domain) = lower(_domain)
  ORDER BY (customer_id IS NULL) ASC, created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('action', 'available');
  END IF;

  IF _row.customer_id = _customer_id THEN
    RETURN jsonb_build_object('action', 'already_assigned', 'domain_id', _row.id);
  END IF;

  IF _row.customer_id IS NOT NULL AND _row.customer_id <> _customer_id THEN
    SELECT * INTO _cust FROM public.customers WHERE id = _row.customer_id;
    RETURN jsonb_build_object(
      'action', 'conflict',
      'conflict', jsonb_build_object(
        'domain_id', _row.id,
        'domain', _row.domain,
        'status', _row.status,
        'customer_id', _row.customer_id,
        'company_name', _cust.company_name,
        'customer_code', _cust.customer_code
      )
    );
  END IF;

  UPDATE public.domains
  SET customer_id = _customer_id, updated_at = now()
  WHERE id = _row.id;

  RETURN jsonb_build_object('action', 'assigned', 'domain_id', _row.id);
END;
$$;

CREATE OR REPLACE FUNCTION public.reassign_domain_to_customer(
  _domain_id uuid,
  _customer_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _row public.domains%ROWTYPE;
BEGIN
  IF _domain_id IS NULL OR _customer_id IS NULL THEN
    RAISE EXCEPTION 'domain_id and customer_id required';
  END IF;

  SELECT * INTO _row FROM public.domains WHERE id = _domain_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('action', 'not_found');
  END IF;

  UPDATE public.domains
  SET customer_id = _customer_id, updated_at = now()
  WHERE id = _domain_id;

  RETURN jsonb_build_object('action', 'reassigned', 'domain_id', _domain_id);
END;
$$;

GRANT EXECUTE ON FUNCTION public.claim_domain_for_customer(text, uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.reassign_domain_to_customer(uuid, uuid) TO authenticated, service_role;