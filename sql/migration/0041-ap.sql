ALTER TABLE apflora.ap RENAME "ApGuid" TO id;
ALTER TABLE apflora.ap ADD UNIQUE (id);
ALTER TABLE apflora.ap RENAME "ApArtId" TO id_old;
ALTER TABLE apflora.ap ADD COLUMN art UUID UNIQUE DEFAULT NULL;
ALTER TABLE apflora.ap RENAME "ApStatus" TO bearbeitung;
ALTER TABLE apflora.ap RENAME "ApJahr" TO start_jahr;
ALTER TABLE apflora.ap RENAME "ApUmsetzung" TO umsetzung;
ALTER TABLE apflora.ap RENAME "ApBearb" TO bearbeiter;
ALTER TABLE apflora.ap RENAME "ProjId" TO proj_id;
ALTER TABLE apflora.ap RENAME "MutWann" TO changed;
ALTER TABLE apflora.ap RENAME "MutWer" TO changed_by;

ALTER TABLE apflora.ap DROP COLUMN "ApArtwert" cascade;
ALTER TABLE apflora.ap DROP COLUMN "ApGuid_alt" cascade;

-- add data from ApArtId to art
UPDATE apflora.ap SET art = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.ap.id_old
) WHERE id_old IS NOT NULL;

-- change primary key
ALTER TABLE apflora.ap DROP CONSTRAINT ap_pkey cascade;
ALTER TABLE apflora.ap ADD PRIMARY KEY (id);
ALTER TABLE apflora.ap ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.ap ALTER COLUMN id_old SET DEFAULT null;

-- comments
COMMENT ON COLUMN apflora.ap.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap.id_old IS 'Frühere id. = SISF2-Nr';
COMMENT ON COLUMN apflora.ap.proj_id IS 'Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj"';
COMMENT ON COLUMN apflora.ap.art IS 'Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert';
COMMENT ON COLUMN apflora.ap.bearbeitung IS 'In welchem Bearbeitungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap.start_jahr IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';
COMMENT ON COLUMN apflora.ap.umsetzung IS 'In welchem Umsetzungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap.bearbeiter IS 'Verantwortliche(r) für die Art';
COMMENT ON COLUMN apflora.ap.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."ap_ApArtId_idx";
DROP index IF EXISTS apflora.apflora."ap_ApBearb_idx";
DROP index IF EXISTS apflora.apflora."ap_ApGuid_idx";
DROP index IF EXISTS apflora.apflora."ap_ApStatus_idx";
DROP index IF EXISTS apflora.apflora."ap_ApUmsetzung_idx";
DROP index IF EXISTS apflora.apflora."ap_ProjId_idx";
-- add new
CREATE INDEX ON apflora.ap USING btree (id);
CREATE INDEX ON apflora.ap USING btree (proj_id);
CREATE INDEX ON apflora.ap USING btree (bearbeitung);
CREATE INDEX ON apflora.ap USING btree (start_jahr);
CREATE INDEX ON apflora.ap USING btree (umsetzung);
CREATE INDEX ON apflora.ap USING btree (bearbeiter);

-- add indexes on dependant tables
CREATE INDEX ON apflora.pop USING btree (ap_id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);

-- change pop
ALTER TABLE apflora.pop RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."pop_ap_id_idx";
ALTER TABLE apflora.pop ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.pop SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.pop.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.pop USING btree (ap_id);
ALTER TABLE apflora.pop DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change apber
ALTER TABLE apflora.apber RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."apber_ap_id_idx";
ALTER TABLE apflora.apber ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.apber SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.apber.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.apber USING btree (ap_id);
ALTER TABLE apflora.apber DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.apber.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change assozart
ALTER TABLE apflora.assozart RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."assozart_ap_id_idx";
ALTER TABLE apflora.assozart ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.assozart SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.assozart.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.assozart USING btree (ap_id);
ALTER TABLE apflora.assozart DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.assozart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change ber
ALTER TABLE apflora.ber RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."ber_ap_id_idx";
ALTER TABLE apflora.ber ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.ber SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.ber.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.ber USING btree (ap_id);
ALTER TABLE apflora.ber DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.ber.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change erfkrit
ALTER TABLE apflora.erfkrit RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."erfkrit_ap_id_idx";
ALTER TABLE apflora.erfkrit ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.erfkrit SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.erfkrit.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.erfkrit USING btree (ap_id);
ALTER TABLE apflora.erfkrit DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.erfkrit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change idealbiotop
ALTER TABLE apflora.idealbiotop RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."idealbiotop_ap_id_idx";
ALTER TABLE apflora.idealbiotop ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.idealbiotop SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.idealbiotop.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.idealbiotop USING btree (ap_id);
ALTER TABLE apflora.idealbiotop DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.idealbiotop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change ziel
ALTER TABLE apflora.ziel RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."ziel_ap_id_idx";
ALTER TABLE apflora.ziel ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.ziel SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.ziel.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.ziel USING btree (ap_id);
ALTER TABLE apflora.ziel DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.ziel.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- change apart
ALTER TABLE apflora.apart RENAME ap_id TO ap_id_old;
DROP index IF EXISTS apflora.apflora."apart_ap_id_idx";
ALTER TABLE apflora.apart ADD COLUMN ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE;
UPDATE apflora.apart SET ap_id = (
  SELECT id FROM apflora.ap WHERE id_old = apflora.apart.ap_id_old
) WHERE ap_id_old IS NOT NULL;
CREATE INDEX ON apflora.apart USING btree (ap_id);
ALTER TABLE apflora.apart DROP COLUMN ap_id_old CASCADE;
COMMENT ON COLUMN apflora.apart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';

-- done: make sure createTable is correct
-- TODO: rename in sql
-- TODO: rename in js
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers containing this table to this file
-- TODO: run migration sql in dev
-- TODO: restart postgrest and test app
-- TODO: special ap functions work?
-- TODO: CHECK child tables: are they correct?
-- TODO: check that unique && default 0 from id_old is gone
-- TODO: update js and run this file on server
-- TODO: restart postgrest

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

-- when ap is inserted
-- ensure apart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_beobart();
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
CREATE FUNCTION apflora.ap_insert_add_apart() RETURNS trigger AS $ap_insert_add_apart$
BEGIN
  INSERT INTO
    apflora.apart (ap_id, taxid)
  VALUES (NEW.id, NEW.id);
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();

-- when ap is inserted
-- ensure apart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_beobart();
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
CREATE FUNCTION apflora.ap_insert_add_apart() RETURNS trigger AS $ap_insert_add_apart$
BEGIN
  INSERT INTO
    apflora.apart (ap_id, taxid)
  VALUES (NEW.id, NEW.id);
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop.ap_id,
    'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id, 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
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
ALTER FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  -- 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop.ap_id,
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id]::text[] AS "url",
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
ALTER FUNCTION apflora.qk2_pop_ohne_popmassnber(apid integer, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id integer, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop.ap_id,
    'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap.id, 'Populationen', apflora.pop.id]::text[] AS "url",
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
ALTER FUNCTION apflora.qk2_pop_ohne_popber(apid integer, berichtjahr integer)
  OWNER TO postgres;

