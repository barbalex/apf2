/*
 * Sicherstellen, das pro Pop/TPop jährlich maximal ein Bericht erstellt wird (massnber, popber, tpopber)
 */
-- drop triggers before creating functions because triggers depend on functions
DROP TRIGGER IF EXISTS tpop_max_one_massnber_per_year ON apflora.tpopmassnber;
DROP FUNCTION IF EXISTS apflora.tpop_max_one_massnber_per_year();
CREATE FUNCTION apflora.tpop_max_one_massnber_per_year() RETURNS trigger AS $tpop_max_one_massnber_per_year$
  BEGIN
    -- check if a tpopmassnber already exists for this year
    IF
      (
        NEW.jahr > 0
        AND NEW.jahr IN
          (
            SELECT
              jahr
            FROM
              apflora.tpopmassnber
            WHERE
              tpop_id = NEW.tpop_id
              AND id <> NEW.id
          )
      )
    THEN
      RAISE EXCEPTION  'Pro Teilpopulation und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_massnber_per_year$ LANGUAGE plpgsql;
CREATE TRIGGER tpop_max_one_massnber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE apflora.tpop_max_one_massnber_per_year();

DROP TRIGGER IF EXISTS pop_max_one_massnber_per_year ON apflora.popmassnber;
DROP FUNCTION IF EXISTS apflora.pop_max_one_massnber_per_year();
CREATE FUNCTION apflora.pop_max_one_massnber_per_year() RETURNS trigger AS $pop_max_one_massnber_per_year$
  BEGIN
    IF
      (
        NEW.jahr > 0
        AND NEW.jahr IN
          (
            SELECT
              jahr
            FROM
              apflora.popmassnber
            WHERE
              pop_id = NEW.pop_id
              AND id <> NEW.id
          )
      )
    THEN
      RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Massnahmenbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$pop_max_one_massnber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_massnber_per_year BEFORE INSERT OR UPDATE ON apflora.popmassnber
  FOR EACH ROW EXECUTE PROCEDURE apflora.pop_max_one_massnber_per_year();

DROP TRIGGER IF EXISTS pop_max_one_popber_per_year ON apflora.popber;
DROP FUNCTION IF EXISTS apflora.pop_max_one_popber_per_year();
CREATE FUNCTION apflora.pop_max_one_popber_per_year() RETURNS trigger AS $pop_max_one_popber_per_year$
  BEGIN
    IF
      (
        NEW.jahr > 0
        AND NEW.jahr IN
          (
            SELECT
              jahr
            FROM
              apflora.popber
            WHERE
              pop_id = NEW.pop_id
              AND id <> NEW.id
          )
      )
    THEN
      RAISE EXCEPTION 'Pro Population und Jahr darf maximal ein Populationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$pop_max_one_popber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER pop_max_one_popber_per_year BEFORE INSERT OR UPDATE ON apflora.popber
  FOR EACH ROW EXECUTE PROCEDURE apflora.pop_max_one_popber_per_year();


DROP TRIGGER IF EXISTS tpop_max_one_tpopber_per_year ON apflora.tpopber;
DROP FUNCTION IF EXISTS apflora.tpop_max_one_tpopber_per_year();
CREATE FUNCTION apflora.tpop_max_one_tpopber_per_year() RETURNS trigger AS $tpop_max_one_tpopber_per_year$
  BEGIN
    -- check if a tpopber already exists for this year
    IF
      (
        NEW.jahr > 0
        AND NEW.jahr IN
        (
          SELECT
            jahr
          FROM
            apflora.tpopber
          WHERE
            tpop_id = NEW.tpop_id
            AND id <> NEW.id
        )
      )
    THEN
      RAISE EXCEPTION 'Pro Teilpopulation und Jahr darf maximal ein Teilpopulationsbericht erfasst werden';
    END IF;
    RETURN NEW;
  END;
$tpop_max_one_tpopber_per_year$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_max_one_tpopber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE apflora.tpop_max_one_tpopber_per_year();

-- when ap is inserted
-- ensure idealbiotop is created too
DROP TRIGGER IF EXISTS ap_insert_add_idealbiotop ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_idealbiotop();
CREATE FUNCTION apflora.ap_insert_add_idealbiotop() RETURNS trigger AS $ap_insert_add_idealbiotop$
BEGIN
  INSERT INTO
    apflora.idealbiotop (ap_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$ap_insert_add_idealbiotop$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_idealbiotop AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_idealbiotop();

-- in case this trigger was not working
-- add idealbiotop where they are missing
insert into apflora.idealbiotop (ap_id)
select apflora.ap.id from apflora.ap
left join apflora.idealbiotop
on apflora.idealbiotop.ap_id = apflora.ap.id
where apflora.idealbiotop.ap_id is null;




-- when ap is updated
-- ensure apart is updated too
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
DROP TRIGGER IF EXISTS ap_update_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_update_add_apart();
CREATE FUNCTION apflora.ap_update_add_apart() RETURNS trigger AS $ap_update_add_apart$
-- on insert, art_id is not yet set
-- so need to do this on update
BEGIN
    -- if apart with this ap and new art_id does not exist yet
    if not exists (select 1 from apflora.apart where ap_id = NEW.id and art_id = NEW.art_id) then
      -- create it
      INSERT INTO
        apflora.apart (ap_id, art_id)
      VALUES (NEW.id, NEW.art_id);
    end if;
  RETURN NEW;
END;
$ap_update_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_update_add_apart AFTER UPDATE ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_update_add_apart();




-- ensure max 3 ekfzaehleinheit per ap
DROP TRIGGER IF EXISTS ekfzaehleinheit_max_3_per_ap ON apflora.ekfzaehleinheit;
DROP FUNCTION IF EXISTS apflora.ekfzaehleinheit_max_3_per_ap();
CREATE FUNCTION apflora.ekfzaehleinheit_max_3_per_ap() RETURNS trigger AS $ekfzaehleinheit_max_3_per_ap$
  DECLARE
    count integer;
  BEGIN
    -- check if 3 ekfzaehleinheit already exists for this ap
    count := (SELECT count(*) FROM apflora.ekfzaehleinheit WHERE ap_id = NEW.ap_id);
    IF count > 2 THEN
      RAISE EXCEPTION  'Pro Aktionsplan dürfen maximal drei EKF-Zähleinheiten erfasst werden';
    END IF;
    RETURN NEW;
  END;
$ekfzaehleinheit_max_3_per_ap$ LANGUAGE plpgsql;
CREATE TRIGGER ekfzaehleinheit_max_3_per_ap BEFORE INSERT ON apflora.ekfzaehleinheit
  FOR EACH ROW EXECUTE PROCEDURE apflora.ekfzaehleinheit_max_3_per_ap();