ALTER TABLE apflora.tpop RENAME "TPopGuid" TO id;
ALTER TABLE apflora.tpop ADD UNIQUE (id);
ALTER TABLE apflora.tpop RENAME "TPopId" TO id_old;
ALTER TABLE apflora.tpop RENAME "PopId" TO pop_id;
ALTER TABLE apflora.tpop RENAME "TPopNr" TO nr;
ALTER TABLE apflora.tpop RENAME "TPopGemeinde" TO gemeinde;
ALTER TABLE apflora.tpop RENAME "TPopFlurname" TO flurname;
ALTER TABLE apflora.tpop RENAME "TPopXKoord" TO x;
ALTER TABLE apflora.tpop RENAME "TPopYKoord" TO y;
ALTER TABLE apflora.tpop RENAME "TPopRadius" TO radius;
ALTER TABLE apflora.tpop RENAME "TPopHoehe" TO hoehe;
ALTER TABLE apflora.tpop RENAME "TPopExposition" TO exposition;
ALTER TABLE apflora.tpop RENAME "TPopKlima" TO klima;
ALTER TABLE apflora.tpop RENAME "TPopNeigung" TO neigung;
ALTER TABLE apflora.tpop RENAME "TPopBeschr" TO beschreibung;
ALTER TABLE apflora.tpop RENAME "TPopKatNr" TO kataster_nr;
ALTER TABLE apflora.tpop RENAME "TPopHerkunft" TO status;
ALTER TABLE apflora.tpop RENAME "TPopHerkunftUnklar" TO status_unklar;
ALTER TABLE apflora.tpop RENAME "TPopHerkunftUnklarBegruendung" TO status_unklar_begruendung;
ALTER TABLE apflora.tpop RENAME "TPopApBerichtRelevant" TO apber_relevant;
ALTER TABLE apflora.tpop RENAME "TPopBekanntSeit" TO bekannt_seit;
ALTER TABLE apflora.tpop RENAME "TPopEigen" TO eigentuemer;
ALTER TABLE apflora.tpop RENAME "TPopKontakt" TO kontakt;
ALTER TABLE apflora.tpop RENAME "TPopNutzungszone" TO nutzungszone;
ALTER TABLE apflora.tpop RENAME "TPopBewirtschafterIn" TO bewirtschafter;
ALTER TABLE apflora.tpop RENAME "TPopBewirtschaftung" TO bewirtschaftung;
ALTER TABLE apflora.tpop RENAME "TPopTxt" TO bemerkungen;
ALTER TABLE apflora.tpop RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpop RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.tpop DROP COLUMN "TPopGuid_alt";

COMMENT ON COLUMN apflora.tpop.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpop DROP CONSTRAINT tpop_pkey;
ALTER TABLE apflora.tpop ADD PRIMARY KEY (id);

-- TODO: update id in dependent tables
-- dependent tables:
-- - tpopbeob
-- - tpopber
-- - tpopmassn
-- - tpopmassnber
-- - tpopkontr

-- 1. Example: tpopber
-- need to update triggers first
DROP TRIGGER IF EXISTS tpopber_on_update_set_mut ON apflora.tpopber;
DROP FUNCTION IF EXISTS tpopber_on_update_set_mut();
CREATE FUNCTION tpopber_on_update_set_mut() RETURNS trigger AS $tpopber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE tpopber_on_update_set_mut();

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

ALTER TABLE apflora.tpopber RENAME tpop_id TO tpop_id_old;
ALTER TABLE apflora.tpopber ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.tpopber SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopber.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
-- need to update many views to do this:
-- so first replace it by new id
ALTER TABLE apflora.tpopber DROP COLUMN tpop_id_old;