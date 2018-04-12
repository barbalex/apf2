ALTER TABLE apflora.pop RENAME "PopGuid" TO id;
ALTER TABLE apflora.pop ADD UNIQUE (id);
ALTER TABLE apflora.pop RENAME "PopId" TO id_old;
ALTER TABLE apflora.pop RENAME "ApArtId" TO ap_id;
ALTER TABLE apflora.pop RENAME "PopNr" TO nr;
ALTER TABLE apflora.pop RENAME "PopName" TO name;
ALTER TABLE apflora.pop RENAME "PopHerkunft" TO status;
ALTER TABLE apflora.pop RENAME "PopHerkunftUnklar" TO status_unklar;
ALTER TABLE apflora.pop RENAME "PopHerkunftUnklarBegruendung" TO status_unklar_begruendung;
ALTER TABLE apflora.pop RENAME "PopBekanntSeit" TO bekannt_seit;
ALTER TABLE apflora.pop RENAME "PopXKoord" TO x;
ALTER TABLE apflora.pop RENAME "PopYKoord" TO y;
ALTER TABLE apflora.pop RENAME "MutWann" TO changed;
ALTER TABLE apflora.pop RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.pop DROP COLUMN "PopGuid_alt";

-- change primary key
ALTER TABLE apflora.pop DROP CONSTRAINT pop_pkey cascade;
ALTER TABLE apflora.pop ADD PRIMARY KEY (id);
ALTER TABLE apflora.pop ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.pop ALTER COLUMN id_old SET DEFAULT null;
CREATE INDEX ON apflora.tpop USING btree (pop_id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);

-- comments
COMMENT ON COLUMN apflora.pop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.pop.id_old IS 'frühere id';

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

-- change tpop
ALTER TABLE apflora.tpop RENAME pop_id TO pop_id_old;
DROP index apflora.apflora."tpop_pop_id_idx";
ALTER TABLE apflora.tpop ADD COLUMN pop_id UUID DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpop USING btree (pop_id);
UPDATE apflora.tpop SET pop_id = (
  SELECT id FROM apflora.pop WHERE id_old = apflora.tpop.pop_id_old
) WHERE pop_id_old IS NOT NULL;
ALTER TABLE apflora.tpop DROP COLUMN pop_id_old CASCADE;
COMMENT ON COLUMN apflora.tpop.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';

-- change popber
ALTER TABLE apflora.popber RENAME pop_id TO pop_id_old;
DROP index apflora.apflora."popber_pop_id_idx";
ALTER TABLE apflora.popber ADD COLUMN pop_id UUID DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.popber USING btree (pop_id);
UPDATE apflora.popber SET pop_id = (
  SELECT id FROM apflora.pop WHERE id_old = apflora.popber.pop_id_old
) WHERE pop_id_old IS NOT NULL;
ALTER TABLE apflora.popber DROP COLUMN pop_id_old CASCADE;
COMMENT ON COLUMN apflora.popber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';

-- change popmassnber
ALTER TABLE apflora.popmassnber RENAME pop_id TO pop_id_old;
DROP index apflora.apflora."popmassnber_pop_id_idx";
ALTER TABLE apflora.popmassnber ADD COLUMN pop_id UUID DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);
UPDATE apflora.popmassnber SET pop_id = (
  SELECT id FROM apflora.pop WHERE id_old = apflora.popmassnber.pop_id_old
) WHERE pop_id_old IS NOT NULL;
ALTER TABLE apflora.popmassnber DROP COLUMN pop_id_old CASCADE;
COMMENT ON COLUMN apflora.popmassnber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';

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