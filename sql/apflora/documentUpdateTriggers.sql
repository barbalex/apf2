-- adresse
DROP TRIGGER IF EXISTS adresse_updated ON apflora.adresse CASCADE;

DROP FUNCTION IF EXISTS adresse_updated () CASCADE;

CREATE FUNCTION adresse_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER adresse_updated
  BEFORE UPDATE ON apflora.adresse
  FOR EACH ROW
  EXECUTE PROCEDURE adresse_updated ();

-- ap
DROP TRIGGER IF EXISTS ap_updated ON apflora.ap CASCADE;

DROP FUNCTION IF EXISTS ap_updated () CASCADE;

CREATE FUNCTION ap_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_updated
  BEFORE UPDATE ON apflora.ap
  FOR EACH ROW
  EXECUTE PROCEDURE ap_updated ();

-- ap_user
DROP TRIGGER IF EXISTS ap_user_updated ON apflora.ap_user CASCADE;

DROP FUNCTION IF EXISTS ap_user_updated () CASCADE;

CREATE FUNCTION ap_user_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_user_updated
  BEFORE UPDATE ON apflora.ap_user
  FOR EACH ROW
  EXECUTE PROCEDURE ap_user_updated ();

