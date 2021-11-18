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

-- ap_file
DROP TRIGGER IF EXISTS ap_file_updated ON apflora.ap_file CASCADE;

DROP FUNCTION IF EXISTS ap_file_updated () CASCADE;

CREATE FUNCTION ap_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_file_updated
  BEFORE UPDATE ON apflora.ap_file
  FOR EACH ROW
  EXECUTE PROCEDURE ap_file_updated ();

-- ap_history
DROP TRIGGER IF EXISTS ap_history_updated ON apflora.ap_history CASCADE;

DROP FUNCTION IF EXISTS ap_history_updated () CASCADE;

CREATE FUNCTION ap_history_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_history_updated
  BEFORE UPDATE ON apflora.ap_history
  FOR EACH ROW
  EXECUTE PROCEDURE ap_history_updated ();

-- userprojekt
-- DROP TRIGGER IF EXISTS userprojekt_updated ON apflora.userprojekt CASCADE;
-- DROP FUNCTION IF EXISTS userprojekt_updated () CASCADE;
-- CREATE FUNCTION userprojekt_updated ()
--   RETURNS TRIGGER
--   AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$
-- LANGUAGE plpgsql;
-- CREATE TRIGGER userprojekt_updated
--   BEFORE UPDATE ON apflora.userprojekt
--   FOR EACH ROW
--   EXECUTE PROCEDURE userprojekt_updated ();
--
-- ap_bearbstand_werte
DROP TRIGGER IF EXISTS ap_bearbstand_werte_updated ON apflora.ap_bearbstand_werte CASCADE;

DROP FUNCTION IF EXISTS ap_bearbstand_werte_updated () CASCADE;

CREATE FUNCTION ap_bearbstand_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_bearbstand_werte_updated
  BEFORE UPDATE ON apflora.ap_bearbstand_werte
  FOR EACH ROW
  EXECUTE PROCEDURE ap_bearbstand_werte_updated ();

