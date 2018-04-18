ALTER TABLE apflora.projekt ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.projekt RENAME "ProjId" TO id_old;
ALTER TABLE apflora.projekt RENAME "ProjName" TO name;
ALTER TABLE apflora.projekt RENAME "MutWann" TO changed;
ALTER TABLE apflora.projekt RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.projekt DROP CONSTRAINT projekt_pkey cascade;
ALTER TABLE apflora.projekt ADD PRIMARY KEY (id);
ALTER TABLE apflora.projekt ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.projekt ALTER COLUMN id_old SET DEFAULT null;

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."projekt_ProjId_idx";
DROP index IF EXISTS apflora.apflora."projekt_ProjName_idx";
-- add new
CREATE INDEX ON apflora.projekt USING btree (id);
CREATE INDEX ON apflora.projekt USING btree (name);

-- change ap
ALTER TABLE apflora.ap RENAME proj_id TO proj_id_old;
DROP index IF EXISTS apflora.apflora."ap_proj_id_idx";
ALTER TABLE apflora.ap ADD COLUMN proj_id UUID DEFAULT NULL REFERENCES apflora.projekt (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.ap SET proj_id = (
  SELECT id FROM apflora.projekt WHERE id_old = apflora.ap.proj_id_old
) WHERE proj_id_old IS NOT NULL;
CREATE INDEX ON apflora.ap USING btree (proj_id);
ALTER TABLE apflora.ap DROP COLUMN proj_id_old CASCADE;
COMMENT ON COLUMN apflora.ap.proj_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "projekt"';

-- change apberuebersicht
ALTER TABLE apflora.apberuebersicht RENAME proj_id TO proj_id_old;
DROP index IF EXISTS apflora.apflora."apberuebersicht_proj_id_idx";
ALTER TABLE apflora.apberuebersicht ADD COLUMN proj_id UUID DEFAULT NULL REFERENCES apflora.projekt (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.apberuebersicht SET proj_id = (
  SELECT id FROM apflora.projekt WHERE id_old = apflora.apberuebersicht.proj_id_old
) WHERE proj_id_old IS NOT NULL;
CREATE INDEX ON apflora.apberuebersicht USING btree (proj_id);
ALTER TABLE apflora.apberuebersicht DROP COLUMN proj_id_old CASCADE;
COMMENT ON COLUMN apflora.apberuebersicht.proj_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "projekt"';

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: special ap functions work?
-- done: CHECK child tables: are they correct?
-- TODO: update js and run this file on server
-- TODO: restart postgrest

DROP TRIGGER IF EXISTS projekt_on_update_set_mut ON apflora.projekt;
DROP FUNCTION IF EXISTS projekt_on_update_set_mut();
CREATE FUNCTION projekt_on_update_set_mut() RETURNS trigger AS $projekt_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$projekt_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER projekt_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.projekt
  FOR EACH ROW EXECUTE PROCEDURE projekt_on_update_set_mut();

DROP FUNCTION IF EXISTS apflora.qk_tpop_ohne_tpopber(apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.qk_tpop_ohne_tpopber(apid uuid, berichtjahr integer)
  RETURNS table(proj_id uuid, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', '4635372c-431c-11e8-bb30-e77f6cdd35a6' , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.pop.ap_id = apflora.ap.id
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
ALTER FUNCTION apflora.qk_tpop_ohne_tpopber(apid uuid, berichtjahr integer)
  OWNER TO postgres;

DROP FUNCTION IF EXISTS apflora.qk_tpop_ohne_massnber(apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.qk_tpop_ohne_massnber(apid uuid, berichtjahr integer)
  RETURNS table(proj_id uuid, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  -- 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    '4635372c-431c-11e8-bb30-e77f6cdd35a6'::uuid AS proj_id,
    apflora.pop.ap_id,
    'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', '4635372c-431c-11e8-bb30-e77f6cdd35a6' , 'Arten', apflora.pop.ap_id, 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
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
ALTER FUNCTION apflora.qk_tpop_ohne_massnber(apid uuid, berichtjahr integer)
  OWNER TO postgres;

DROP FUNCTION IF EXISTS apflora.qk_pop_ohne_popmassnber(apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.qk_pop_ohne_popmassnber(apid uuid, berichtjahr integer)
  RETURNS table(proj_id uuid, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  -- 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', '4635372c-431c-11e8-bb30-e77f6cdd35a6' , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap.id
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
ALTER FUNCTION apflora.qk_pop_ohne_popmassnber(apid uuid, berichtjahr integer)
  OWNER TO postgres;

DROP FUNCTION IF EXISTS apflora.qk_pop_ohne_popber(apid uuid, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.qk_pop_ohne_popber(apid uuid, berichtjahr integer)
  RETURNS table(proj_id uuid, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap.proj_id,
    apflora.pop.ap_id,
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', '4635372c-431c-11e8-bb30-e77f6cdd35a6' , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop.ap_id = apflora.ap.id
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
ALTER FUNCTION apflora.qk_pop_ohne_popber(apid uuid, berichtjahr integer)
  OWNER TO postgres;
