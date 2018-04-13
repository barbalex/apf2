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
ALTER TABLE apflora.tpop RENAME "TPopHerkunftUnklarBegruendung" TO status_unklar_grund;
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


-- change primary key
ALTER TABLE apflora.tpop DROP CONSTRAINT tpop_pkey;
ALTER TABLE apflora.tpop ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpop ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.tpop ALTER COLUMN id_old SET DEFAULT null;
CREATE INDEX ON apflora.tpopber USING btree (tpop_id);
CREATE INDEX ON apflora.tpopmassn USING btree (tpop_id);
CREATE INDEX ON apflora.tpopmassnber USING btree (tpop_id);
CREATE INDEX ON apflora.tpopbeob USING btree (tpop_id);
CREATE INDEX ON apflora.tpopkontr USING btree (tpop_id);

-- comments
COMMENT ON COLUMN apflora.tpop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop.id_old IS 'frühere id';

-- drop existing indexes
DROP index apflora.apflora."pop_ApArtId_idx";
DROP index apflora.apflora."pop_PopBekanntSeit_idx";
DROP index apflora.apflora."pop_PopGuid_idx";
DROP index apflora.apflora."pop_PopHerkunft_idx";
DROP index apflora.apflora."pop_PopId_idx";
DROP index apflora.apflora."pop_PopName_idx";
DROP index apflora.apflora."pop_PopNr_idx";
DROP index apflora.apflora."pop_PopXKoord_idx";
DROP index apflora.apflora."pop_PopYKoord_idx";
-- add new
CREATE INDEX ON apflora.pop USING btree (id);
TODO

-- TODO: update id in dependent tables
-- dependent tables:
-- - tpopbeob
-- - tpopber
-- - tpopmassn
-- - tpopmassnber
-- - tpopkontr

-- change tpopber
ALTER TABLE apflora.tpopber RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."tpopber_tpop_id_idx";
ALTER TABLE apflora.tpopber ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopber USING btree (tpop_id);
UPDATE apflora.tpopber SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopber.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
ALTER TABLE apflora.tpopber DROP COLUMN tpop_id_old cascade;
COMMENT ON COLUMN apflora.tpopber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';

-- change tpopmassn
ALTER TABLE apflora.tpopmassn RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."tpopmassn_tpop_id_idx";
ALTER TABLE apflora.tpopmassn ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopmassn USING btree (tpop_id);
UPDATE apflora.tpopmassn SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopmassn.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
ALTER TABLE apflora.tpopmassn DROP COLUMN tpop_id_old cascade;
COMMENT ON COLUMN apflora.tpopmassn.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';

-- change tpopmassnber
ALTER TABLE apflora.tpopmassnber RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."tpopmassnber_tpop_id_idx";
ALTER TABLE apflora.tpopmassnber ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopmassnber USING btree (tpop_id);
UPDATE apflora.tpopmassnber SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopmassnber.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
ALTER TABLE apflora.tpopmassnber DROP COLUMN tpop_id_old cascade;
COMMENT ON COLUMN apflora.tpopmassnber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';

-- change tpopbeob
ALTER TABLE apflora.tpopbeob RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."tpopbeob_tpop_id_idx";
ALTER TABLE apflora.tpopbeob ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopbeob USING btree (tpop_id);
UPDATE apflora.tpopbeob SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopbeob.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
ALTER TABLE apflora.tpopbeob DROP COLUMN tpop_id_old cascade;
COMMENT ON COLUMN apflora.tpopbeob.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';

-- change tpopkontr
ALTER TABLE apflora.tpopkontr RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."tpopkontr_tpop_id_idx";
ALTER TABLE apflora.tpopkontr ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopkontr USING btree (tpop_id);
UPDATE apflora.tpopkontr SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopkontr.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
ALTER TABLE apflora.tpopkontr DROP COLUMN tpop_id_old cascade;
COMMENT ON COLUMN apflora.tpopkontr.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';

-- TODO: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: CHECK zaehl: are they correct
-- TODO: update js and run this file on server
-- TODO: restart postgrest