
-- Add customer_code column
ALTER TABLE public.customers ADD COLUMN customer_code TEXT UNIQUE;

-- Function to generate customer code from company name
CREATE OR REPLACE FUNCTION public.generate_customer_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  clean_name TEXT;
  words TEXT[];
  letters TEXT := '';
  random_digits TEXT;
  candidate TEXT;
  attempts INT := 0;
BEGIN
  -- Clean company name: remove common suffixes and special chars
  clean_name := upper(NEW.company_name);
  clean_name := regexp_replace(clean_name, '\s*(GMBH|AG|KG|OHG|UG|E\.V\.|EV|GBGR|MBH|CO|&|UND)\s*', ' ', 'gi');
  clean_name := regexp_replace(clean_name, '[^A-Z ]', '', 'g');
  clean_name := trim(regexp_replace(clean_name, '\s+', ' ', 'g'));
  
  -- Split into words
  words := string_to_array(clean_name, ' ');
  
  -- Generate 3 letters based on word count
  IF array_length(words, 1) >= 3 THEN
    -- 3+ words: first letter of first 3 words
    letters := substr(words[1], 1, 1) || substr(words[2], 1, 1) || substr(words[3], 1, 1);
  ELSIF array_length(words, 1) = 2 THEN
    -- 2 words: first 2 letters of first word + first letter of second
    letters := substr(words[1], 1, 2) || substr(words[2], 1, 1);
  ELSIF array_length(words, 1) = 1 AND length(words[1]) >= 3 THEN
    -- 1 word: first 3 letters
    letters := substr(words[1], 1, 3);
  ELSE
    letters := rpad(coalesce(words[1], 'XXX'), 3, 'X');
  END IF;
  
  -- Ensure exactly 3 letters
  letters := rpad(substr(letters, 1, 3), 3, 'X');
  
  -- Try to find a unique code
  LOOP
    random_digits := lpad((floor(random() * 1000))::TEXT, 3, '0');
    candidate := letters || random_digits;
    
    -- Check uniqueness
    IF NOT EXISTS (SELECT 1 FROM public.customers WHERE customer_code = candidate AND id != NEW.id) THEN
      NEW.customer_code := candidate;
      RETURN NEW;
    END IF;
    
    attempts := attempts + 1;
    IF attempts > 100 THEN
      -- Fallback: add random letter variation
      letters := chr(65 + floor(random() * 26)::int) || chr(65 + floor(random() * 26)::int) || chr(65 + floor(random() * 26)::int);
      attempts := 0;
    END IF;
  END LOOP;
END;
$$;

-- Trigger on insert
CREATE TRIGGER set_customer_code
BEFORE INSERT ON public.customers
FOR EACH ROW
WHEN (NEW.customer_code IS NULL)
EXECUTE FUNCTION public.generate_customer_code();
