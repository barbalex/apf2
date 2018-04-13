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

-- change primary key
ALTER TABLE apflora.pop DROP CONSTRAINT pop_pkey cascade;
ALTER TABLE apflora.pop ADD PRIMARY KEY (id);
ALTER TABLE apflora.pop ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.pop ALTER COLUMN id_old SET DEFAULT null;
CREATE INDEX ON apflora.tpop USING btree (pop_id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);

-- comments
COMMENT ON COLUMN apflora.pop.id IS 'Primärschlüssel der Tabelle "pop"';
COMMENT ON COLUMN apflora.pop.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.pop.nr IS 'Nummer der Population';
COMMENT ON COLUMN apflora.pop.name IS 'Bezeichnung der Population';
COMMENT ON COLUMN apflora.pop.status IS 'Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.pop.status_unklar IS '1 = die Herkunft der Population ist unklar';
COMMENT ON COLUMN apflora.pop.status_unklar_begruendung IS 'Begründung, wieso die Herkunft unklar ist';
COMMENT ON COLUMN apflora.pop.bekannt_seit IS 'Seit wann ist die Population bekannt?';
COMMENT ON COLUMN apflora.pop.x IS 'Wird in der Regel von einer Teilpopulation übernommen';
COMMENT ON COLUMN apflora.pop.y IS 'Wird in der Regel von einer Teilpopulation übernommen';
COMMENT ON COLUMN apflora.pop.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

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
CREATE INDEX ON apflora.pop USING btree (ap_id);
CREATE INDEX ON apflora.pop USING btree (status);
CREATE INDEX ON apflora.pop USING btree (x);
CREATE INDEX ON apflora.pop USING btree (y);
CREATE INDEX ON apflora.pop USING btree (nr);
CREATE INDEX ON apflora.pop USING btree (name);
CREATE INDEX ON apflora.pop USING btree (bekannt_seit);

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
DROP TRIGGER IF EXISTS pop_max_one_massnber_per_year ON apflora.popmassnber;
ALTER TABLE apflora.popmassnber RENAME pop_id TO pop_id_old;
DROP index apflora.apflora."popmassnber_pop_id_idx";
ALTER TABLE apflora.popmassnber ADD COLUMN pop_id UUID DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);
UPDATE apflora.popmassnber SET pop_id = (
  SELECT id FROM apflora.pop WHERE id_old = apflora.popmassnber.pop_id_old
) WHERE pop_id_old IS NOT NULL;
ALTER TABLE apflora.popmassnber DROP COLUMN pop_id_old CASCADE;
COMMENT ON COLUMN apflora.popmassnber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
CREATE TRIGGER pop_max_one_massnber_per_year BEFORE INSERT OR UPDATE ON apflora.popmassnber
  FOR EACH ROW EXECUTE PROCEDURE apflora.pop_max_one_massnber_per_year();

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: special pop functions work?
-- TODO: CHECK child tables: are they correct?
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS pop_on_update_set_mut ON apflora.pop;
DROP FUNCTION IF EXISTS pop_on_update_set_mut();
CREATE FUNCTION pop_on_update_set_mut() RETURNS trigger AS $pop_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$pop_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER pop_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.pop
  FOR EACH ROW EXECUTE PROCEDURE pop_on_update_set_mut();

-- run all views
ALTER TABLE apflora.pop DROP COLUMN "PopGuid_alt";

DROP FUNCTION apflora.qk2_tpop_ohne_massnber(integer,integer);
CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  -- 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    1 AS "ProjId",
    apflora.pop.ap_id,
    'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.pop.ap_id, 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
  FROM
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id
  WHERE
    apflora.tpop.apber_relevant = 1
    AND apflora.tpop.id IN (
      -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.typ IN (1, 2, 3)
        AND apflora.tpopmassn.jahr < $2
    )
    AND apflora.tpop.id IN (
      -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr.tpop_id
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr.jahr = $2
    )
    AND apflora.tpop.id NOT IN (
      -- 3. "TPop mit TPopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopmassnber.tpop_id
      FROM
        apflora.tpopmassnber
      WHERE
        apflora.tpopmassnber.jahr = $2
    )
    AND apflora.pop.ap_id = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP FUNCTION apflora.qk2_tpop_ohne_tpopber(integer,integer);
CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop.ap_id,
    'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    apflora.tpop.apber_relevant = 1
    AND apflora.tpop.id IN (
      -- 1. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr.tpop_id
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr.jahr = $2
    )
    AND apflora.tpop.id NOT IN (
      -- 2. "TPop mit TPopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopber.tpop_id
      FROM
        apflora.tpopber
      WHERE
        apflora.tpopber.jahr = $2
    )
    AND apflora.pop.ap_id = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP FUNCTION apflora.qk2_pop_ohne_popmassnber(integer,integer);
CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  -- 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop.ap_id,
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    apflora.pop.id IN (
      SELECT
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.apber_relevant = 1
      GROUP BY
        apflora.tpop.pop_id
    )
    AND apflora.pop.id IN (
      -- 3. "Pop mit TPop mit verlangten TPopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.id IN (
          -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopmassn.tpop_id
          FROM
            apflora.tpopmassn
          WHERE
            apflora.tpopmassn.typ IN (1, 2, 3)
            AND apflora.tpopmassn.jahr < $2
        )
        AND apflora.tpop.id IN (
          -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopkontr.tpop_id
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
            AND apflora.tpopkontr.jahr = $2
        )
    )
    AND apflora.pop.id NOT IN (
      -- 4. "Pop mit PopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popmassnber.pop_id
      FROM
        apflora.popmassnber
      WHERE
        apflora.popmassnber.jahr = $2
    )
    AND apflora.pop.ap_id = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP FUNCTION apflora.qk2_pop_ohne_popber(integer,integer);
CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop.ap_id,
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap."ApArtId"
  WHERE
    apflora.pop.id IN (
      SELECT
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.apber_relevant = 1
      GROUP BY
        apflora.tpop.pop_id
    )
    AND apflora.pop.id IN (
      -- 3. "Pop mit TPop mit verlangten TPopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.id IN (
          -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
          SELECT DISTINCT
          apflora.tpopmassn.tpop_id
          FROM
            apflora.tpopmassn
          WHERE
            apflora.tpopmassn.typ in (1, 2, 3)
            AND apflora.tpopmassn.jahr < $2
        )
        AND apflora.tpop.id IN (
          -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopkontr.tpop_id
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
            AND apflora.tpopkontr.jahr = $2
        )
    )
    AND apflora.pop.id NOT IN (
      -- 4. "Pop mit PopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popber.pop_id
      FROM
        apflora.popber
      WHERE
        apflora.popber.jahr = $2
    )
    AND apflora.pop.ap_id = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  OWNER TO postgres;
