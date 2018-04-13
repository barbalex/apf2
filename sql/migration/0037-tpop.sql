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

ALTER TABLE apflora.tpop DROP COLUMN "TPopGuid_alt" cascade;

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
COMMENT ON COLUMN apflora.tpop.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.tpop.nr IS 'Nummer der Teilpopulation';
COMMENT ON COLUMN apflora.tpop.gemeinde IS 'Gemeinde';
COMMENT ON COLUMN apflora.tpop.flurname IS 'Flurname';
COMMENT ON COLUMN apflora.tpop.x IS 'X-Koordinate';
COMMENT ON COLUMN apflora.tpop.y IS 'Y-Koordinate';
COMMENT ON COLUMN apflora.tpop.radius IS 'Radius der Teilpopulation (m)';
COMMENT ON COLUMN apflora.tpop.hoehe IS 'Höhe über Meer (m)';
COMMENT ON COLUMN apflora.tpop.exposition IS 'Exposition / Besonnung des Standorts';
COMMENT ON COLUMN apflora.tpop.klima IS 'Klima des Standorts';
COMMENT ON COLUMN apflora.tpop.neigung IS 'Hangneigung des Standorts';
COMMENT ON COLUMN apflora.tpop.beschreibung IS 'Beschreibung der Fläche';
COMMENT ON COLUMN apflora.tpop.kataster_nr IS 'Kataster-Nummer';
COMMENT ON COLUMN apflora.tpop.status IS 'Herkunft der Teilpopulation. Auswahl aus Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.tpop.status_unklar IS 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)';
COMMENT ON COLUMN apflora.tpop.status_unklar_grund IS 'Wieso ist der Status unklar?';
COMMENT ON COLUMN apflora.tpop.apber_relevant IS 'Ist die Teilpopulation für den AP-Bericht relevant? Auswahl aus der Tabelle "tpop_apberrelevant_werte"';
COMMENT ON COLUMN apflora.tpop.bekannt_seit IS 'Seit wann ist die Teilpopulation bekannt?';
COMMENT ON COLUMN apflora.tpop.eigentuemer IS 'EigentümerIn';
COMMENT ON COLUMN apflora.tpop.kontakt IS 'Kontaktperson vor Ort';
COMMENT ON COLUMN apflora.tpop.nutzungszone IS 'Nutzungszone';
COMMENT ON COLUMN apflora.tpop.bewirtschafter IS 'Wer bewirtschaftet die Fläche?';
COMMENT ON COLUMN apflora.tpop.bewirtschaftung IS 'Wie wird die Fläche bewirtschaftet?';
COMMENT ON COLUMN apflora.tpop.bemerkungen IS 'Bemerkungen zur Teilpopulation';
COMMENT ON COLUMN apflora.tpop.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop.changed IS 'Von wem wurde der Datensatz zuletzt geändert?';

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
CREATE INDEX ON apflora.tpop USING btree (id);
CREATE INDEX ON apflora.tpop USING btree (pop_id);
CREATE INDEX ON apflora.tpop USING btree (status);
CREATE INDEX ON apflora.tpop USING btree (apber_relevant);
CREATE INDEX ON apflora.tpop USING btree (x);
CREATE INDEX ON apflora.tpop USING btree (y);
CREATE INDEX ON apflora.tpop USING btree (nr);
CREATE INDEX ON apflora.tpop USING btree (gemeinde);
CREATE INDEX ON apflora.tpop USING btree (flurname);

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
DROP TRIGGER IF EXISTS tpop_max_one_massnber_per_year ON apflora.tpopmassnber;
ALTER TABLE apflora.tpopmassnber RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."tpopmassnber_tpop_id_idx";
ALTER TABLE apflora.tpopmassnber ADD COLUMN tpop_id UUID DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopmassnber USING btree (tpop_id);
UPDATE apflora.tpopmassnber SET tpop_id = (
  SELECT id FROM apflora.tpop WHERE id_old = apflora.tpopmassnber.tpop_id_old
) WHERE tpop_id_old IS NOT NULL;
ALTER TABLE apflora.tpopmassnber DROP COLUMN tpop_id_old cascade;
COMMENT ON COLUMN apflora.tpopmassnber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';
CREATE TRIGGER tpop_max_one_massnber_per_year BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE apflora.tpop_max_one_massnber_per_year();

-- change tpopbeob
ALTER TABLE apflora.tpopbeob RENAME tpop_id TO tpop_id_old;
DROP index apflora.apflora."beobzuordnung_TPopId_idx";
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

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: special tpop functions work?
-- done: CHECK child tables: are they correct?
-- TODO: update js and run this file on server
-- TODO: restart postgrest

CREATE OR REPLACE FUNCTION apflora.correct_vornach_beginnap_stati(apid integer)
 RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
 BEGIN

   -- diejenigen Werte setzen, welche in der Benutzeroberfläche angezeigt werden

   -- angesiedelt, erloschen/nicht etabliert
   UPDATE apflora.tpop
   SET apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" <= apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" <= "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" > apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND "ApJahr" > "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   -- angesiedelt, aktuell
   UPDATE apflora.tpop
   SET apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" IS NULL
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" <= apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
       AND "ApJahr" <= "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.tpop
   SET apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop."PopId"
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND "ApJahr" > apflora.tpop.bekannt_seit
       AND apflora.ap."ApArtId" = $1
   );

   UPDATE apflora.pop
   SET "PopHerkunft" = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE "PopId" IN (
     SELECT
       pop."PopId"
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
     WHERE
       "PopHerkunft" = 200  -- angesiedelt nach Beginn AP, aktuell
       AND "ApJahr" > "PopBekanntSeit"
       AND apflora.ap."ApArtId" = $1
   );

 END;
 $$;

ALTER FUNCTION apflora.correct_vornach_beginnap_stati(apid integer)
   OWNER TO postgres;

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
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.apber_relevant = 1
      GROUP BY
        apflora.tpop.pop_id
    )
    AND apflora.pop."PopId" IN (
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
        apflora.tpop.pop_id
      FROM
        apflora.tpop
      WHERE
        apflora.tpop.apber_relevant = 1
      GROUP BY
        apflora.tpop.pop_id
    )
    AND apflora.pop."PopId" IN (
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

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop.pop_id
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
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
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    1 AS "ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.pop."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop.id]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop.nr)]::text[] AS text
  FROM
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop.pop_id
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
    AND apflora.pop."ApArtId" = $1
  $$
  LANGUAGE sql STABLE;
ALTER FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  OWNER TO postgres;


DROP TRIGGER IF EXISTS tpop_on_update_set_mut ON apflora.tpop;
DROP FUNCTION IF EXISTS tpop_on_update_set_mut();
CREATE FUNCTION tpop_on_update_set_mut() RETURNS trigger AS $tpop_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpop_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpop
  FOR EACH ROW EXECUTE PROCEDURE tpop_on_update_set_mut();

-- update all views!
-- repeat tpop_key because it did not work on testing:
ALTER TABLE apflora.tpop DROP CONSTRAINT tpop_pkey;
ALTER TABLE apflora.tpop ADD PRIMARY KEY (id);