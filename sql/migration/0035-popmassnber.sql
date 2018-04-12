ALTER TABLE apflora.popmassnber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerId" TO id_old;
ALTER TABLE apflora.popmassnber RENAME "PopId" TO pop_id;
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerJahr" TO jahr;
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerErfolgsbeurteilung" TO beurteilung;
ALTER TABLE apflora.popmassnber RENAME "PopMassnBerTxt" TO bemerkungen;
ALTER TABLE apflora.popmassnber RENAME "MutWann" TO changed;
ALTER TABLE apflora.popmassnber RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.popmassnber DROP CONSTRAINT popmassnber_pkey;
ALTER TABLE apflora.popmassnber ADD PRIMARY KEY (id);
ALTER TABLE apflora.popmassnber ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.popmassnber ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.popmassnber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.popmassnber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.popmassnber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popmassnber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popmassnber.beurteilung IS 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.popmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popmassnber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."popmassnber_PopId_idx";
DROP index apflora.apflora."popmassnber_PopMassnBerErfolgsbeurteilung_idx";
DROP index apflora.apflora."popmassnber_PopMassnBerId_idx";
DROP index apflora.apflora."popmassnber_PopMassnBerJahr_idx";
-- add new
CREATE INDEX ON apflora.popmassnber USING btree (id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (beurteilung);
CREATE INDEX ON apflora.popmassnber USING btree (jahr);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

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

CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.pop."PopId" IN (
      SELECT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopApBerichtRelevant" = 1
      GROUP BY
        apflora.tpop."PopId"
    )
    AND apflora.pop."PopId" IN (
      -- 3. "Pop mit TPop mit verlangten TPopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpop."PopId"
      FROM
        apflora.tpop
      WHERE
        apflora.tpop."TPopId" IN (
          -- 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopmassn.tpop_id
          FROM
            apflora.tpopmassn
          WHERE
            apflora.tpopmassn.typ IN (1, 2, 3)
            AND apflora.tpopmassn.jahr < $2
        )
        AND apflora.tpop."TPopId" IN (
          -- 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
          SELECT DISTINCT
            apflora.tpopkontr."TPopId"
          FROM
            apflora.tpopkontr
          WHERE
            apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
            AND apflora.tpopkontr."TPopKontrJahr" = $2
        )
    )
    AND apflora.pop."PopId" NOT IN (
      -- 4. "Pop mit PopMassnBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popmassnber.pop_id
      FROM
        apflora.popmassnber
      WHERE
        apflora.popmassnber.jahr = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP TRIGGER IF EXISTS popmassnber_on_update_set_mut ON apflora.popmassnber;
DROP FUNCTION IF EXISTS popmassnber_on_update_set_mut();
CREATE FUNCTION popmassnber_on_update_set_mut() RETURNS trigger AS $popmassnber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$popmassnber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER popmassnber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.popmassnber
  FOR EACH ROW EXECUTE PROCEDURE popmassnber_on_update_set_mut();
