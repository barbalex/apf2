/*
 * Sicherstellen, das pro Pop/TPop jährlich maximal ein Bericht erstellt wird (massnber, popber, tpopber)
 */

DROP FUNCTION IF EXISTS tpop_max_one_massnber_per_year();
CREATE FUNCTION tpop_max_one_massnber_per_year() RETURNS trigger AS $tpop_max_one_massnber_per_year$
  BEGIN
    -- check if a tpopmassnber already exists for this year
    IF
      (
        NEW."TPopMassnBerJahr" > 0
        AND NEW."TPopMassnBerJahr" IN
          (
            SELECT
              "TPopMassnBerJahr"
            FROM
              apflora.tpopmassnber
            WHERE
              "TPopId" = NEW."TPopId"
              AND "TPopMassnBerId" <> NEW."TPopMassnBerId"
          )
      )
    THEN
      RAISE EXCEPTION  'Pro Teilpopulation und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_massnber_per_year$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS tpop_max_one_massnber_per_year ON apflora.tpopmassnber;
CREATE TRIGGER tpop_max_one_massnber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE tpop_max_one_massnber_per_year();


DROP TRIGGER IF EXISTS pop_max_one_massnber_per_year ON apflora.popmassnber;
DROP FUNCTION IF EXISTS pop_max_one_massnber_per_year();
CREATE FUNCTION pop_max_one_massnber_per_year() RETURNS trigger AS $pop_max_one_massnber_per_year$
  BEGIN
    IF
      (
        NEW."PopMassnBerJahr" > 0
        AND NEW."PopMassnBerJahr" IN
          (
            SELECT
              "PopMassnBerJahr"
            FROM
              apflora.popmassnber
            WHERE
              "PopId" = NEW."PopId"
              AND "PopMassnBerId" <> NEW."PopMassnBerId"
          )
      )
    THEN
      RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$pop_max_one_massnber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_massnber_per_year BEFORE INSERT OR UPDATE ON apflora.popmassnber
  FOR EACH ROW EXECUTE PROCEDURE pop_max_one_massnber_per_year();



DROP TRIGGER IF EXISTS pop_max_one_popber_per_year ON apflora.popber;
DROP FUNCTION IF EXISTS pop_max_one_popber_per_year();
CREATE FUNCTION pop_max_one_popber_per_year() RETURNS trigger AS $pop_max_one_popber_per_year$
  BEGIN
    IF
      (
        NEW."PopBerJahr" > 0
        AND NEW."PopBerJahr" IN
          (
            SELECT
              "PopBerJahr"
            FROM
              apflora.popber
            WHERE
              "PopId" = NEW."PopId"
              AND "PopBerId" <> NEW."PopBerId"
          )
      )
    THEN
      RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Populationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$pop_max_one_popber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_popber_per_year BEFORE INSERT OR UPDATE ON apflora.popber
  FOR EACH ROW EXECUTE PROCEDURE pop_max_one_popber_per_year();



DROP TRIGGER IF EXISTS tpop_max_one_tpopber_per_year ON apflora.tpopber;
DROP FUNCTION IF EXISTS tpop_max_one_tpopber_per_year();
CREATE FUNCTION tpop_max_one_tpopber_per_year() RETURNS trigger AS $tpop_max_one_tpopber_per_year$
  BEGIN
    -- check if a tpopber already exists for this year
    IF
      (
        NEW."TPopBerJahr" > 0
        AND NEW."TPopBerJahr" IN
        (
          SELECT
            "TPopBerJahr"
          FROM
            apflora.tpopber
          WHERE
            "TPopId" = NEW."TPopId"
            AND "TPopBerId" <> NEW."TPopBerId"
        )
      )
    THEN
      RAISE EXCEPTION 'Pro Teilpopulation und Jahr darf maximal ein Teilpopulationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_tpopber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_tpopber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE tpop_max_one_tpopber_per_year();

-- when ap is inserted
-- ensure idealbiotop is created too
DROP TRIGGER IF EXISTS ap_insert_add_idealbiotop ON apflora.ap;
DROP FUNCTION IF EXISTS ap_insert_add_idealbiotop();
CREATE FUNCTION ap_insert_add_idealbiotop() RETURNS trigger AS $ap_insert_add_idealbiotop$
BEGIN
  INSERT INTO
    apflora.idealbiotop ("IbApArtId")
  VALUES (NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_idealbiotop$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_idealbiotop AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE ap_insert_add_idealbiotop();

-- when ap is inserted
-- ensure beobart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP FUNCTION IF EXISTS ap_insert_add_beobart();
CREATE FUNCTION ap_insert_add_beobart() RETURNS trigger AS $ap_insert_add_beobart$
BEGIN
  INSERT INTO
    apflora.beobart ("ApArtId", "TaxonomieId")
  VALUES (NEW."ApArtId", NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_beobart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_beobart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE ap_insert_add_beobart();

-- when ap is inserted
-- ensure beobart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP FUNCTION IF EXISTS ap_insert_add_beobart();
CREATE FUNCTION ap_insert_add_beobart() RETURNS trigger AS $ap_insert_add_beobart$
BEGIN
  INSERT INTO
    apflora.beobart ("ApArtId", "TaxonomieId")
  VALUES (NEW."ApArtId", NEW."ApArtId");
  RETURN NEW;
END;
$ap_insert_add_beobart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_beobart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE ap_insert_add_beobart();