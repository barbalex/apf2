ALTER TABLE apflora.popber ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.popber RENAME "PopBerId" TO id_old;
ALTER TABLE apflora.popber RENAME "PopId" TO pop_id;
ALTER TABLE apflora.popber RENAME "PopBerJahr" TO jahr;
ALTER TABLE apflora.popber RENAME "PopBerEntwicklung" TO entwicklung;
ALTER TABLE apflora.popber RENAME "PopBerTxt" TO bemerkungen;
ALTER TABLE apflora.popber RENAME "MutWann" TO changed;
ALTER TABLE apflora.popber RENAME "MutWer" TO changed_by;

-- change primary key
ALTER TABLE apflora.popber DROP CONSTRAINT popber_pkey;
ALTER TABLE apflora.popber ADD PRIMARY KEY (id);
ALTER TABLE apflora.popber ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.popber ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.popber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.popber.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.popber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.popber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."popber_PopBerEntwicklung_idx";
DROP index apflora.apflora."popber_PopBerId_idx";
DROP index apflora.apflora."popber_PopBerJahr_idx";
DROP index apflora.apflora."popber_PopId_idx";
-- add new
CREATE INDEX ON apflora.popber USING btree (id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popber USING btree (entwicklung);
CREATE INDEX ON apflora.popber USING btree (jahr);

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest

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

CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):' AS hw,
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
      -- 3. "Pop mit TPop mit verlangten TPopBer im Berichtjahr" ermitteln:
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
            apflora.tpopmassn.typ in (1, 2, 3)
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
      -- 4. "Pop mit PopBer im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.popber.pop_id
      FROM
        apflora.popber
      WHERE
        apflora.popber.jahr = $2
    )
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  OWNER TO postgres;

DROP TRIGGER IF EXISTS popber_on_update_set_mut ON apflora.popber;
DROP FUNCTION IF EXISTS popber_on_update_set_mut();
CREATE FUNCTION popber_on_update_set_mut() RETURNS trigger AS $popber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$popber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER popber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.popber
  FOR EACH ROW EXECUTE PROCEDURE popber_on_update_set_mut();

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