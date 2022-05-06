/*
 * Sicherstellen, das pro Pop/TPop jährlich maximal ein Bericht erstellt wird (massnber, popber, tpopber)
 */
-- drop triggers before creating functions because triggers depend on functions
DROP TRIGGER IF EXISTS tpop_max_one_massnber_per_year ON apflora.tpopmassnber;

DROP FUNCTION IF EXISTS apflora.tpop_max_one_massnber_per_year ();

CREATE FUNCTION apflora.tpop_max_one_massnber_per_year ()
  RETURNS TRIGGER
  AS $tpop_max_one_massnber_per_year$
BEGIN
  -- check if a tpopmassnber already exists for this year
  IF (NEW.jahr > 0 AND NEW.jahr IN (
    SELECT
      jahr
    FROM
      apflora.tpopmassnber
    WHERE
      tpop_id = NEW.tpop_id AND id <> NEW.id)) THEN
    RAISE EXCEPTION 'Pro Teilpopulation und Jahr darf maximal ein Massnahmenbericht erfasst werden';
  END IF;
  RETURN NEW;
END;
$tpop_max_one_massnber_per_year$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_massnber_per_year
  BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.tpop_max_one_massnber_per_year ();

DROP TRIGGER IF EXISTS pop_max_one_massnber_per_year ON apflora.popmassnber;

DROP FUNCTION IF EXISTS apflora.pop_max_one_massnber_per_year ();

CREATE OR REPLACE FUNCTION apflora.pop_max_one_massnber_per_year ()
  RETURNS TRIGGER
  AS $pop_max_one_massnber_per_year$
BEGIN
  IF (NEW.jahr IS NOT NULL AND NEW.jahr IN (
    SELECT
      jahr
    FROM
      apflora.popmassnber
    WHERE
      pop_id = NEW.pop_id AND id <> NEW.id)) THEN
    RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Massnahmenbericht erfasst werden';
  END IF;
  RETURN NEW;
END;
$pop_max_one_massnber_per_year$
LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_massnber_per_year
  BEFORE INSERT OR UPDATE ON apflora.popmassnber
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.pop_max_one_massnber_per_year ();

DROP TRIGGER IF EXISTS pop_max_one_popber_per_year ON apflora.popber;

DROP FUNCTION IF EXISTS apflora.pop_max_one_popber_per_year ();

CREATE FUNCTION apflora.pop_max_one_popber_per_year ()
  RETURNS TRIGGER
  AS $pop_max_one_popber_per_year$
BEGIN
  IF (NEW.jahr > 0 AND NEW.jahr IN (
    SELECT
      jahr
    FROM
      apflora.popber
    WHERE
      pop_id = NEW.pop_id AND id <> NEW.id)) THEN
    RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Populationsbericht erfasst werden';
  END IF;
  RETURN NEW;
END;
$pop_max_one_popber_per_year$
LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_popber_per_year
  BEFORE INSERT OR UPDATE ON apflora.popber
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.pop_max_one_popber_per_year ();

DROP TRIGGER IF EXISTS tpop_max_one_tpopber_per_year ON apflora.tpopber;

DROP FUNCTION IF EXISTS apflora.tpop_max_one_tpopber_per_year ();

CREATE FUNCTION apflora.tpop_max_one_tpopber_per_year ()
  RETURNS TRIGGER
  AS $tpop_max_one_tpopber_per_year$
BEGIN
  -- check if a tpopber already exists for this year
  IF (NEW.jahr > 0 AND NEW.jahr IN (
    SELECT
      jahr
    FROM
      apflora.tpopber
    WHERE
      tpop_id = NEW.tpop_id AND id <> NEW.id)) THEN
    RAISE EXCEPTION 'Pro Teilpopulation und Jahr darf maximal ein Teilpopulationsbericht erfasst werden';
  END IF;
  RETURN NEW;
END;
$tpop_max_one_tpopber_per_year$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_tpopber_per_year
  BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.tpop_max_one_tpopber_per_year ();

-- when ap is inserted
-- ensure idealbiotop is created too
DROP TRIGGER IF EXISTS ap_insert_add_idealbiotop ON apflora.ap;

DROP FUNCTION IF EXISTS apflora.ap_insert_add_idealbiotop ();

CREATE FUNCTION apflora.ap_insert_add_idealbiotop ()
  RETURNS TRIGGER
  AS $ap_insert_add_idealbiotop$
BEGIN
  INSERT INTO apflora.idealbiotop (ap_id)
    VALUES (NEW.id);
  RETURN NEW;
END;
$ap_insert_add_idealbiotop$
LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_idealbiotop
  AFTER INSERT ON apflora.ap
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.ap_insert_add_idealbiotop ();

-- in case this trigger was not working
-- add idealbiotop where they are missing
INSERT INTO apflora.idealbiotop (ap_id)
SELECT
  apflora.ap.id
FROM
  apflora.ap
  LEFT JOIN apflora.idealbiotop ON apflora.idealbiotop.ap_id = apflora.ap.id
WHERE
  apflora.idealbiotop.ap_id IS NULL;

-- when ap is updated
-- ensure apart is updated too
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;

DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart ();

DROP TRIGGER IF EXISTS ap_update_add_apart ON apflora.ap;

DROP FUNCTION IF EXISTS apflora.ap_update_add_apart ();

-- corrected 2022.05.06 to solve 532:
CREATE OR REPLACE  FUNCTION apflora.ap_update_add_apart ()
  RETURNS TRIGGER
  AS $ap_update_add_apart$
  -- on insert, art_id is not yet set
  -- so need to do this on update
BEGIN
  -- if apart with this ap and new art_id does not exist yet
  IF NEW.art_id IS NOT NULL AND NOT EXISTS (
    SELECT
      1
    FROM
      apflora.apart
    WHERE
      ap_id = NEW.id AND art_id = NEW.art_id) THEN
    -- create it
    INSERT INTO apflora.apart (ap_id, art_id)
      VALUES (NEW.id, NEW.art_id);
  END IF;
  RETURN NEW;
END;
$ap_update_add_apart$
LANGUAGE plpgsql;

CREATE TRIGGER ap_update_add_apart
  AFTER UPDATE ON apflora.ap
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.ap_update_add_apart ();

-- ensure max 3 ekzaehleinheit per ap
DROP TRIGGER IF EXISTS ekzaehleinheit_max_3_per_ap ON apflora.ekzaehleinheit;

DROP FUNCTION IF EXISTS apflora.ekzaehleinheit_max_3_per_ap ();

CREATE FUNCTION apflora.ekzaehleinheit_max_3_per_ap ()
  RETURNS TRIGGER
  AS $ekzaehleinheit_max_3_per_ap$
DECLARE
  count integer;
BEGIN
  -- check if 3 ekzaehleinheit already exists for this ap
  count := (
    SELECT
      count(*)
    FROM
      apflora.ekzaehleinheit
    WHERE
      ap_id = NEW.ap_id);
  IF count > 2 THEN
    RAISE EXCEPTION 'Pro Aktionsplan dürfen maximal drei EK-Zähleinheiten erfasst werden';
  END IF;
  RETURN NEW;
END;
$ekzaehleinheit_max_3_per_ap$
LANGUAGE plpgsql;

CREATE TRIGGER ekzaehleinheit_max_3_per_ap
  BEFORE INSERT ON apflora.ekzaehleinheit
  FOR EACH ROW
  EXECUTE PROCEDURE apflora.ekzaehleinheit_max_3_per_ap ();

-- ensure new ap have apqk
DROP TRIGGER IF EXISTS ap_has_apqk ON apflora.apqk CASCADE;

DROP FUNCTION IF EXISTS ap_has_apqk () CASCADE;

CREATE FUNCTION ap_has_apqk ()
  RETURNS TRIGGER
  AS $ap_has_apqk$
BEGIN
  INSERT INTO apflora.apqk (ap_id, qk_name)
  SELECT DISTINCT
    apflora.ap.id,
    apflora.qk.name
  FROM
    apflora.ap,
    apflora.qk
  WHERE
    apflora.ap.id = NEW.id;
  RETURN NEW;
END;
$ap_has_apqk$
LANGUAGE plpgsql;

CREATE TRIGGER ap_has_apqk
  AFTER INSERT ON apflora.ap
  FOR EACH ROW
  EXECUTE PROCEDURE ap_has_apqk ();

