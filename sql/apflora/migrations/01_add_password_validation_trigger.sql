-- Add stronger password validation
-- This replaces the existing constraint with a more comprehensive check

ALTER TABLE apflora.user
  DROP CONSTRAINT IF EXISTS password_length_minimum_6;

ALTER TABLE apflora.user
  DROP CONSTRAINT IF EXISTS pass_length_minimum_6;

-- Create a function to validate password complexity
CREATE OR REPLACE FUNCTION apflora.validate_password_complexity()
  RETURNS TRIGGER
  AS $$
BEGIN
  -- Only validate if password is being set or changed
  IF NEW.pass IS NOT NULL AND (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.pass IS DISTINCT FROM OLD.pass)) THEN
    -- Check if password is already hashed (bcrypt hashes are 60 characters)
    -- If it's already hashed, skip validation (it was validated before encryption)
    IF char_length(NEW.pass) = 60 AND NEW.pass ~ '^\$2[aby]\$' THEN
      RETURN NEW;
    END IF;
    
    -- Minimum length 16
    IF char_length(NEW.pass) < 16 THEN
      RAISE EXCEPTION 'Passwort muss mindestens 16 Zeichen lang sein (aktuell: % Zeichen)', char_length(NEW.pass);
    END IF;
    
    -- Must contain lowercase letter
    IF NEW.pass !~ '[a-z]' THEN
      RAISE EXCEPTION 'Passwort muss Kleinbuchstaben enthalten';
    END IF;
    
    -- Must contain uppercase letter
    IF NEW.pass !~ '[A-Z]' THEN
      RAISE EXCEPTION 'Passwort muss Grossbuchstaben enthalten';
    END IF;
    
    -- Must contain number
    IF NEW.pass !~ '[0-9]' THEN
      RAISE EXCEPTION 'Passwort muss Nummern enthalten';
    END IF;
    
    -- Must contain special character
    IF NEW.pass !~ '[!@#$%^&*(),.?":{}|<>]' THEN
      RAISE EXCEPTION 'Passwort muss Sonderzeichen enthalten (!@#$%%^&*(),.?":{}|<>)';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

COMMENT ON FUNCTION apflora.validate_password_complexity() IS 
  'Validates password meets complexity requirements: min 16 chars, lowercase, uppercase, numbers, special chars';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS validate_password_before_encrypt ON apflora.user;

-- Create trigger that runs BEFORE the encrypt_pass trigger
-- Triggers run in alphabetical order, so we prefix with '0_' to ensure it runs first
CREATE TRIGGER "0_validate_password_before_encrypt"
  BEFORE INSERT OR UPDATE ON apflora.user
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.validate_password_complexity();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO apflora_manager;
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO apflora_reader;
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO apflora_ap_reader;
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO apflora_ap_writer;
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO apflora_freiwillig;
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO authenticator;
GRANT EXECUTE ON FUNCTION apflora.validate_password_complexity() TO anon;
