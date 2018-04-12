ALTER TABLE apflora.tpopkontr RENAME "TPopKontrGuid" TO id;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrId" TO id_old;
ALTER TABLE apflora.tpopkontr RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrTyp" TO typ;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrDatum" TO datum;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrJahr" TO jahr;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBearb" TO bearbeiter;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrJungpfl" TO jungpflanzen_anzahl;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrVitalitaet" TO vitalitaet;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrUeberleb" TO ueberlebensrate;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrEntwicklung" TO entwicklung;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrUrsach" TO ursachen;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrUrteil" TO erfolgsbeurteilung;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrAendUms" TO umsetzung_aendern;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrAendKontr" TO kontrolle_aendern;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrTxt" TO bemerkungen;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrLeb" TO lr_delarze;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrFlaeche" TO flaeche;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrLebUmg" TO lr_umgebung_delarze;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrVegTyp" TO vegetationstyp;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrKonkurrenz" TO konkurrenz;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrMoosschicht" TO moosschicht;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrKrautschicht" TO krautschicht;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrStrauchschicht" TO strauchschicht;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBaumschicht" TO baumschicht;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBodenTyp" TO boden_typ;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBodenKalkgehalt" TO boden_kalkgehalt;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBodenDurchlaessigkeit" TO boden_durchlaessigkeit;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBodenHumus" TO boden_humus;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBodenNaehrstoffgehalt" TO boden_naehrstoffgehalt;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrBodenAbtrag" TO boden_abtrag;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrWasserhaushalt" TO wasserhaushalt;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrIdealBiotopUebereinst" TO idealbiotop_uebereinstimmung;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrHandlungsbedarf" TO handlungsbedarf;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrUebFlaeche" TO flaeche_ueberprueft;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrPlan" TO plan_vorhanden;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrVeg" TO deckung_vegetation;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrNaBo" TO deckung_nackter_boden;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrUebPfl" TO deckung_ap_art;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrJungPflJN" TO jungpflanzen_vorhanden;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrVegHoeMax" TO vegetationshoehe_maximum;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrVegHoeMit" TO vegetationshoehe_mittel;
ALTER TABLE apflora.tpopkontr RENAME "TPopKontrGefaehrdung" TO gefaehrdung;
ALTER TABLE apflora.tpopkontr RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontr RENAME "MutWer" TO changed_by;
ALTER TABLE apflora.tpopkontr RENAME "ZeitGuid" TO zeit_id;

-- change primary key
ALTER TABLE apflora.tpopkontr DROP CONSTRAINT tpopkontr_pkey cascade;
ALTER TABLE apflora.tpopkontr ADD PRIMARY KEY (id);
ALTER TABLE apflora.tpopkontr ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.tpopkontr ALTER COLUMN id_old SET DEFAULT null;
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (tpopkontr_id);

-- comments
COMMENT ON COLUMN apflora.tpopkontr.id IS 'Primärschlüssel. Wird u.a. verwendet für die Identifikation der Beobachtung im nationalen Beobachtungs-Daten-Kreislauf';
COMMENT ON COLUMN apflora.tpopkontr.id_old IS 'frühere id';
COMMENT ON COLUMN apflora.tpopkontr.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopkontr.typ IS 'Typ der Kontrolle. Auswahl aus Tabelle "tpopkontr_typ_werte"';
COMMENT ON COLUMN apflora.tpopkontr.datum IS 'Wann wurde kontrolliert?';
COMMENT ON COLUMN apflora.tpopkontr.jahr IS 'In welchem Jahr wurde kontrolliert? Für welches Jahr gilt die Beschreibung?';
COMMENT ON COLUMN apflora.tpopkontr.bearbeiter IS 'Wer hat kontrolliert? Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_anzahl IS 'Anzahl Jungpflanzen';
COMMENT ON COLUMN apflora.tpopkontr.vitalitaet IS 'Vitalität der Pflanzen';
COMMENT ON COLUMN apflora.tpopkontr.ueberlebensrate IS 'Überlebensrate in Prozent';
COMMENT ON COLUMN apflora.tpopkontr.entwicklung IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopkontr.ursachen IS 'Ursachen der Entwicklung';
COMMENT ON COLUMN apflora.tpopkontr.erfolgsbeurteilung IS 'Erfolgsbeurteilung';
COMMENT ON COLUMN apflora.tpopkontr.umsetzung_aendern IS 'Vorschlag für Änderung der Umsetzung';
COMMENT ON COLUMN apflora.tpopkontr.kontrolle_aendern IS 'Vorschlag für Änderung der Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.bemerkungen IS 'Bemerkungen zur Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.lr_delarze IS 'Lebensraumtyp nach Delarze';
COMMENT ON COLUMN apflora.tpopkontr.flaeche IS 'Fläche der Teilpopulation';
COMMENT ON COLUMN apflora.tpopkontr.lr_umgebung_delarze IS 'Lebensraumtyp der direkt angrenzenden Umgebung (nach Delarze)';
COMMENT ON COLUMN apflora.tpopkontr.vegetationstyp IS 'Vegetationstyp';
COMMENT ON COLUMN apflora.tpopkontr.konkurrenz IS 'Konkurrenz';
COMMENT ON COLUMN apflora.tpopkontr.moosschicht IS 'Moosschicht';
COMMENT ON COLUMN apflora.tpopkontr.krautschicht IS 'Krautschicht';
COMMENT ON COLUMN apflora.tpopkontr.strauchschicht IS 'Strauchschicht, ehemals Verbuschung (%)';
COMMENT ON COLUMN apflora.tpopkontr.baumschicht IS 'Baumschicht';
COMMENT ON COLUMN apflora.tpopkontr.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.tpopkontr.boden_kalkgehalt IS 'Kalkgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_durchlaessigkeit IS 'Durchlässigkeit des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_humus IS 'Humusgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_naehrstoffgehalt IS 'Nährstoffgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_abtrag IS 'Oberbodenabtrag';
COMMENT ON COLUMN apflora.tpopkontr.wasserhaushalt IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.tpopkontr.idealbiotop_uebereinstimmung IS 'Übereinstimmung mit dem Idealbiotop';
COMMENT ON COLUMN apflora.tpopkontr.handlungsbedarf IS 'Handlungsbedarf bezüglich Biotop';
COMMENT ON COLUMN apflora.tpopkontr.flaeche_ueberprueft IS 'Überprüfte Fläche in m2. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.plan_vorhanden IS 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.deckung_vegetation IS 'Von Pflanzen, Streu oder Moos bedeckter Boden (%). Nur für Freiwilligen-Erfolgskontrolle. Nur bis 2012 erfasst.';
COMMENT ON COLUMN apflora.tpopkontr.deckung_nackter_boden IS 'Flächenanteil nackter Boden (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.deckung_ap_art IS 'Flächenanteil der überprüften Pflanzenart (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_vorhanden IS 'Gibt es neben alten Pflanzen auch junge? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_maximum IS 'Maximale Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_mittel IS 'Mittlere Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.gefaehrdung IS 'Gefährdung. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.zeit_id IS 'GUID für den Export von Zeiten in EvAB';
COMMENT ON COLUMN apflora.tpopkontr.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- drop existing indexes
DROP index apflora.apflora."tpopkontr_TPopId_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrBearb_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrDatum_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrEntwicklung_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrGuid_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrId_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrIdealBiotopUebereinst_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrJahr_idx";
DROP index apflora.apflora."tpopkontr_TPopKontrTyp_idx";
DROP index apflora.apflora."tpopkontr_ZeitGuid_idx";
-- add new
CREATE INDEX ON apflora.tpopkontr USING btree (id);
CREATE INDEX ON apflora.tpopkontr USING btree (tpop_id);
CREATE INDEX ON apflora.tpopkontr USING btree (bearbeiter);
CREATE INDEX ON apflora.tpopkontr USING btree (entwicklung);
CREATE INDEX ON apflora.tpopkontr USING btree (idealbiotop_uebereinstimmung);
CREATE INDEX ON apflora.tpopkontr USING btree (jahr);
CREATE INDEX ON apflora.tpopkontr USING btree (typ);
CREATE INDEX ON apflora.tpopkontr USING btree (datum);
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree (zeit_id);

-- change tpopkontrzaehl
ALTER TABLE apflora.tpopkontrzaehl RENAME tpopkontr_id TO tpopkontr_id_old;
ALTER TABLE apflora.tpopkontrzaehl ADD COLUMN tpopkontr_id UUID DEFAULT NULL REFERENCES apflora.tpopkontr (id) ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (tpopkontr_id);
UPDATE apflora.tpopkontrzaehl SET tpopkontr_id = (
  SELECT id FROM apflora.tpopkontr WHERE id_old = apflora.tpopkontrzaehl.tpopkontr_id_old
) WHERE tpopkontr_id_old IS NOT NULL;
DROP index apflora.apflora."tpopkontrzaehl_tpopkontr_id_idx";
ALTER TABLE apflora.tpopkontrzaehl DROP COLUMN tpopkontr_id_old CASCADE;

-- done: make sure createTable is correct
-- done: rename in sql
-- done: rename in js
-- done: check if old id was used somewhere. If so: rename that field, add new one and update that
-- done: add all views, functions, triggers containing this table to this file
-- done: run migration sql in dev
-- done: restart postgrest and test app
-- done: CHECK zaehl: are they correct
-- TODO: update js and run this file on server
-- TODO: restart postgrest
-- DO add views because old id was often removed?

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    1 AS "ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.pop."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
  FROM
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId"
  WHERE
    apflora.tpop."TPopApBerichtRelevant" = 1
    AND apflora.tpop."TPopId" IN (
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
        apflora.tpopkontr.tpop_id
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr.jahr = $2
    )
    AND apflora.tpop."TPopId" NOT IN (
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

CREATE OR REPLACE FUNCTION apflora.qk2_tpop_ohne_tpopber(apid integer, berichtjahr integer)
  RETURNS table("ProjId" integer, "ApArtId" integer, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap."ProjId",
    apflora.pop."ApArtId",
    'Teilpopulation mit Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
    ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
    ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
  FROM
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
  WHERE
    apflora.tpop."TPopApBerichtRelevant" = 1
    AND apflora.tpop."TPopId" IN (
      -- 1. "TPop mit Kontrolle im Berichtjahr" ermitteln:
      SELECT DISTINCT
        apflora.tpopkontr.tpop_id
      FROM
        apflora.tpopkontr
      WHERE
        apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
        AND apflora.tpopkontr.jahr = $2
    )
    AND apflora.tpop."TPopId" NOT IN (
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

DROP TRIGGER IF EXISTS tpopkontr_on_update_set_mut ON apflora.tpopkontr;
DROP FUNCTION IF EXISTS tpopkontr_on_update_set_mut();
CREATE FUNCTION tpopkontr_on_update_set_mut() RETURNS trigger AS $tpopkontr_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontr_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontr
  FOR EACH ROW EXECUTE PROCEDURE tpopkontr_on_update_set_mut();


DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr.id,
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr.id,
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

-- drop old fields
ALTER TABLE apflora.tpopkontr DROP COLUMN "TPopKontrGuid_alt";
ALTER TABLE apflora.tpopkontr DROP COLUMN "ZeitGuid_alt";
ALTER TABLE apflora.tpopkontr DROP COLUMN "TPopKontrMutDat";
DROP VIEW IF EXISTS apflora.v_tpopkontr_verwaist;
DROP VIEW IF EXISTS apflora.v_tpopkontr_nachflurname;

-- add views


DROP VIEW IF EXISTS apflora.v_pop_anzkontr;
CREATE OR REPLACE VIEW apflora.v_pop_anzkontr AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  pop_status_werte.text AS "Pop Status",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.pop."PopHerkunftUnklar" AS "Pop Status unklar",
  apflora.pop."PopHerkunftUnklarBegruendung" AS "Pop Begruendung fuer unklaren Status",
  apflora.pop."PopXKoord" AS "Pop X-Koordinaten",
  apflora.pop."PopYKoord" AS "Pop Y-Koordinaten",
  count(apflora.tpopkontr.id) AS "Anzahl Kontrollen"
FROM
  ((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = pop_status_werte.code
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text,
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  pop_status_werte.text,
  apflora.pop."PopHerkunftUnklar",
  apflora.pop."PopHerkunftUnklarBegruendung",
  apflora.pop."PopBekanntSeit",
  apflora.pop."PopXKoord",
  apflora.pop."PopYKoord"
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr";

DROP VIEW IF EXISTS apflora.v_ap_anzkontr;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontr AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  count(apflora.tpopkontr.id) AS "Anzahl Kontrollen"
FROM
  (((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  LEFT JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    LEFT JOIN
      apflora.tpopkontr
      ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text
ORDER BY
  apflora.ae_eigenschaften.artname;

DROP VIEW IF EXISTS apflora.v_ap_anzkontrinjahr;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontrinjahr AS
SELECT
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.ap."ApStatus" BETWEEN 1 AND 3
GROUP BY
  apflora.ap."ApArtId",
  apflora.ae_eigenschaften.artname,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_tpopkontr;
CREATE OR REPLACE VIEW apflora.v_tpopkontr AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.familie AS "Familie",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte.text AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "domPopHerkunft_1".text AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius m",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopkontr.id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id AS "Kontr id",
  apflora.tpopkontr.jahr AS "Kontr Jahr",
  apflora.tpopkontr.datum AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr.ueberlebensrate AS "Kontr Ueberlebensrate",
  apflora.tpopkontr.vitalitaet AS "Kontr Vitalitaet",
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
  apflora.tpopkontr.ursachen AS "Kontr Ursachen",
  apflora.tpopkontr.erfolgsbeurteilung AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr.umsetzung_aendern AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr.kontrolle_aendern AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr.bemerkungen AS "Kontr Bemerkungen",
  apflora.tpopkontr.lr_delarze AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr.lr_umgebung_delarze AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr.vegetationstyp AS "Kontr Vegetationstyp",
  apflora.tpopkontr.konkurrenz AS "Kontr Konkurrenz",
  apflora.tpopkontr.moosschicht AS "Kontr Moosschicht",
  apflora.tpopkontr.krautschicht AS "Kontr Krautschicht",
  apflora.tpopkontr.strauchschicht AS "Kontr Strauchschicht",
  apflora.tpopkontr.baumschicht AS "Kontr Baumschicht",
  apflora.tpopkontr.boden_typ AS "Kontr Bodentyp",
  apflora.tpopkontr.boden_kalkgehalt AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr.boden_durchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr.boden_humus AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr.boden_abtrag AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr.wasserhaushalt AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr.handlungsbedarf AS "Kontr Handlungsbedarf",
  apflora.tpopkontr.flaeche_ueberprueft AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr.flaeche AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr.plan_vorhanden AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr.deckung_vegetation AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr.deckung_nackter_boden AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr.deckung_ap_art AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr.vegetationshoehe_maximum AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr.vegetationshoehe_mittel AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr.gefaehrdung AS "Kontr Gefaehrdung",
  apflora.tpopkontr.changed AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr.changed_by AS "Kontrolle zuletzt geaendert von",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "Zaehlungen Anzahlen",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "Zaehlungen Einheiten",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "Zaehlungen Methoden"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.ae_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1".code = apflora.tpop."TPopHerkunft"
WHERE
  apflora.ae_eigenschaften.taxid > 150
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.familie,
  apflora.ae_eigenschaften.artname,
  apflora.ap_bearbstand_werte.text,
  apflora.ap."ApJahr",
  apflora.ap_umsetzung_werte.text,
  "tblAdresse_1"."AdrName",
  apflora.pop."PopId",
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.pop."PopName",
  apflora.pop_status_werte.text,
  apflora.pop."PopBekanntSeit",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname",
  "domPopHerkunft_1".text,
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopHerkunftUnklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopRadius",
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopExposition",
  apflora.tpop."TPopKlima",
  apflora.tpop."TPopNeigung",
  apflora.tpop."TPopBeschr",
  apflora.tpop."TPopKatNr",
  apflora.tpop."TPopApBerichtRelevant",
  apflora.tpop."TPopEigen",
  apflora.tpop."TPopKontakt",
  apflora.tpop."TPopNutzungszone",
  apflora.tpop."TPopBewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung",
  apflora.tpopkontr.id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpopkontr_webgisbun;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_webgisbun AS
SELECT
  apflora.ae_eigenschaften.taxid AS "APARTID",
  apflora.ae_eigenschaften.artname AS "APART",
  apflora.pop."PopGuid" AS "POPGUID",
  apflora.pop."PopNr" AS "POPNR",
  apflora.tpop."TPopGuid" AS "TPOPGUID",
  apflora.tpop."TPopNr" AS "TPOPNR",
  apflora.tpopkontr.id AS "KONTRGUID",
  apflora.tpopkontr.jahr AS "KONTRJAHR",
  --TODO: convert?
  apflora.tpopkontr.datum AS "KONTRDAT",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "KONTRTYP",
  apflora.adresse."AdrName" AS "KONTRBEARBEITER",
  apflora.tpopkontr.ueberlebensrate AS "KONTRUEBERLEBENSRATE",
  apflora.tpopkontr.vitalitaet AS "KONTRVITALITAET",
  apflora.tpop_entwicklung_werte.text AS "KONTRENTWICKLUNG",
  apflora.tpopkontr.ursachen AS "KONTRURSACHEN",
  apflora.tpopkontr.erfolgsbeurteilung AS "KONTRERFOLGBEURTEIL",
  apflora.tpopkontr.umsetzung_aendern AS "KONTRAENDUMSETZUNG",
  apflora.tpopkontr.kontrolle_aendern AS "KONTRAENDKONTROLLE",
  apflora.tpop."TPopXKoord" AS "KONTR_X",
  apflora.tpop."TPopYKoord" AS "KONTR_Y",
  apflora.tpopkontr.bemerkungen AS "KONTRBEMERKUNGEN",
  apflora.tpopkontr.lr_delarze AS "KONTRLRMDELARZE",
  apflora.tpopkontr.lr_umgebung_delarze AS "KONTRDELARZEANGRENZ",
  apflora.tpopkontr.vegetationstyp AS "KONTRVEGTYP",
  apflora.tpopkontr.konkurrenz AS "KONTRKONKURRENZ",
  apflora.tpopkontr.moosschicht AS "KONTRMOOSE",
  apflora.tpopkontr.krautschicht AS "KONTRKRAUTSCHICHT",
  apflora.tpopkontr.strauchschicht AS "KONTRSTRAUCHSCHICHT",
  apflora.tpopkontr.baumschicht AS "KONTRBAUMSCHICHT",
  apflora.tpopkontr.boden_typ AS "KONTRBODENTYP",
  apflora.tpopkontr.boden_kalkgehalt AS "KONTRBODENKALK",
  apflora.tpopkontr.boden_durchlaessigkeit AS "KONTRBODENDURCHLAESSIGK",
  apflora.tpopkontr.boden_humus AS "KONTRBODENHUMUS",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "KONTRBODENNAEHRSTOFF",
  apflora.tpopkontr.boden_abtrag AS "KONTROBERBODENABTRAG",
  apflora.tpopkontr.wasserhaushalt AS "KONTROBODENWASSERHAUSHALT",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "KONTRUEBEREINSTIMMUNIDEAL",
  apflora.tpopkontr.handlungsbedarf AS "KONTRHANDLUNGSBEDARF",
  apflora.tpopkontr.flaeche_ueberprueft AS "KONTRUEBERPRUFTFLAECHE",
  apflora.tpopkontr.flaeche AS "KONTRFLAECHETPOP",
  apflora.tpopkontr.plan_vorhanden AS "KONTRAUFPLAN",
  apflora.tpopkontr.deckung_vegetation AS "KONTRDECKUNGVEG",
  apflora.tpopkontr.deckung_nackter_boden AS "KONTRDECKUNGBODEN",
  apflora.tpopkontr.deckung_ap_art AS "KONTRDECKUNGART",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "KONTRJUNGEPLANZEN",
  apflora.tpopkontr.vegetationshoehe_maximum AS "KONTRMAXHOEHEVEG",
  apflora.tpopkontr.vegetationshoehe_mittel AS "KONTRMITTELHOEHEVEG",
  apflora.tpopkontr.gefaehrdung AS "KONTRGEFAEHRDUNG",
  -- TODO: convert
  apflora.tpopkontr.changed AS "KONTRCHANGEDAT",
  apflora.tpopkontr.changed_by AS "KONTRCHANGEBY",
  string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', ') AS "ZAEHLEINHEITEN",
  array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', ') AS "ANZAHLEN",
  string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ') AS "METHODEN"
FROM
  apflora.pop_status_werte AS "domPopHerkunft_1"
  RIGHT JOIN
    (((((((apflora.ae_eigenschaften
    INNER JOIN
      apflora.ap
      ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
    INNER JOIN
      (apflora.pop
      INNER JOIN
        (apflora.tpop
        INNER JOIN
          ((((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.pop_status_werte
      ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
    LEFT JOIN
      apflora.tpopkontr_idbiotuebereinst_werte
      ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
  LEFT JOIN
    apflora.adresse AS "tblAdresse_1"
    ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
  ON "domPopHerkunft_1".code = apflora.tpop."TPopHerkunft"
WHERE
  apflora.ae_eigenschaften.taxid > 150
GROUP BY
  apflora.ae_eigenschaften.taxid,
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopGuid",
  apflora.pop."PopNr",
  apflora.tpop."TPopId",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum,
  apflora.tpopkontr_typ_werte."DomainTxt",
  apflora.adresse."AdrName",
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop_entwicklung_werte.text,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text,
  apflora.tpopkontr.handlungsbedarf,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.changed,
  apflora.tpopkontr.changed_by
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_tpopkontr_letztesjahr cascade;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letztesjahr AS
SELECT
  apflora.tpop."TPopId",
  max(apflora.tpopkontr.jahr) AS "MaxTPopKontrJahr",
  count(apflora.tpopkontr.id) AS "AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.tpopkontr
    ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id
WHERE
  (
    apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopkontr.jahr IS NOT NULL
  )
  OR (
    apflora.tpopkontr.typ IS NULL
    AND apflora.tpopkontr.jahr IS NULL
  )
GROUP BY
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopkontr_letzteid;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_letzteid AS
SELECT
  apflora.v_tpopkontr_letztesjahr."TPopId",
  max(apflora.tpopkontr.id::text) AS "MaxTPopKontrId",
  max(apflora.v_tpopkontr_letztesjahr."AnzTPopKontr") AS "AnzTPopKontr"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.v_tpopkontr_letztesjahr
    ON
      (apflora.v_tpopkontr_letztesjahr."MaxTPopKontrJahr" = apflora.tpopkontr.jahr)
      AND (apflora.tpopkontr.tpop_id = apflora.v_tpopkontr_letztesjahr."TPopId")
GROUP BY
  apflora.v_tpopkontr_letztesjahr."TPopId";

DROP VIEW IF EXISTS apflora.v_tpop_letzteKontrId;
CREATE OR REPLACE VIEW apflora.v_tpop_letzteKontrId AS
SELECT
  apflora.tpop."TPopId",
  apflora.v_tpopkontr_letzteid."MaxTPopKontrId",
  apflora.v_tpopkontr_letzteid."AnzTPopKontr"
FROM
  apflora.tpop
  LEFT JOIN
    apflora.v_tpopkontr_letzteid
    ON apflora.tpop."TPopId" = apflora.v_tpopkontr_letzteid."TPopId";

DROP VIEW IF EXISTS apflora.v_tpopber_letzteid cascade;
CREATE OR REPLACE VIEW apflora.v_tpopber_letzteid AS
SELECT
  apflora.tpopkontr.tpop_id,
  (
    select id
    from apflora.tpopber
    where tpop_id = apflora.tpopkontr.tpop_id
    order by changed desc
    limit 1
  ) AS "MaxTPopBerId",
  max(apflora.tpopber.jahr) AS "MaxTPopBerJahr",
  count(apflora.tpopber.id) AS "AnzTPopBer"
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopber
    ON apflora.tpopkontr.tpop_id = apflora.tpopber.tpop_id
WHERE
  apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
  AND apflora.tpopber.jahr IS NOT NULL
GROUP BY
  apflora.tpopkontr.tpop_id;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_write;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_write AS
SELECT
  CAST(apflora.tpopkontr.id AS varchar(50)) AS tpopkontrid,
  apflora.tpopkontr.typ,
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum::timestamp,
  apflora.tpopkontr.bearbeiter,
  apflora.tpopkontr.jungpflanzen_anzahl,
  apflora.tpopkontr.ueberlebensrate,
  apflora.tpopkontr.entwicklung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpopkontr.ursachen,
  apflora.tpopkontr.erfolgsbeurteilung,
  apflora.tpopkontr.umsetzung_aendern,
  apflora.tpopkontr.kontrolle_aendern,
  apflora.tpopkontr.lr_delarze,
  apflora.tpopkontr.flaeche,
  apflora.tpopkontr.lr_umgebung_delarze,
  apflora.tpopkontr.vegetationstyp,
  apflora.tpopkontr.konkurrenz,
  apflora.tpopkontr.moosschicht,
  apflora.tpopkontr.krautschicht,
  apflora.tpopkontr.strauchschicht,
  apflora.tpopkontr.baumschicht,
  apflora.tpopkontr.boden_typ,
  apflora.tpopkontr.boden_kalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit,
  apflora.tpopkontr.boden_humus,
  apflora.tpopkontr.boden_naehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag,
  apflora.tpopkontr.wasserhaushalt,
  apflora.tpopkontr.idealbiotop_uebereinstimmung,
  apflora.tpopkontr.flaeche_ueberprueft,
  apflora.tpopkontr.plan_vorhanden,
  apflora.tpopkontr.deckung_vegetation,
  apflora.tpopkontr.deckung_nackter_boden,
  apflora.tpopkontr.deckung_ap_art,
  apflora.tpopkontr.jungpflanzen_vorhanden,
  apflora.tpopkontr.vegetationshoehe_maximum,
  apflora.tpopkontr.vegetationshoehe_mittel,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.bemerkungen,
  apflora.tpopkontr.changed::timestamp,
  apflora.tpopkontr.changed_by
FROM
  apflora.tpopkontr;

DROP VIEW IF EXISTS apflora.v_tpopkontr_fuergis_read;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_fuergis_read AS
SELECT
  apflora.ap."ApArtId" AS apartid,
  apflora.ae_eigenschaften.artname AS artname,
  apflora.ap_bearbstand_werte.text AS apherkunft,
  apflora.ap."ApJahr" AS apjahr,
  apflora.ap_umsetzung_werte.text AS apumsetzung,
  CAST(apflora.pop."PopGuid" AS varchar(50)) AS popguid,
  apflora.pop."PopNr" AS popnr,
  apflora.pop."PopName" AS popname,
  apflora.pop_status_werte.text AS popherkunft,
  apflora.pop."PopBekanntSeit" AS popbekanntseit,
  CAST(apflora.tpop."TPopGuid" AS varchar(50)) AS tpopguid,
  apflora.tpop."TPopNr" AS tpopnr,
  apflora.tpop."TPopGemeinde" AS tpopgemeinde,
  apflora.tpop."TPopFlurname" AS tpopflurname,
  apflora.tpop."TPopXKoord" AS tpopxkoord,
  apflora.tpop."TPopYKoord" AS tpopykoord,
  apflora.tpop."TPopBekanntSeit" AS tpopbekanntseit,
  CAST(apflora.tpopkontr.id AS varchar(50)) AS tpopkontrid,
  apflora.tpopkontr.jahr AS tpopkontrjahr,
  apflora.tpopkontr.datum::timestamp AS tpopkontrdatum,
  apflora.tpopkontr_typ_werte."DomainTxt" AS tpopkontrtyp,
  apflora.adresse."AdrName" AS tpopkontrbearb,
  apflora.tpopkontr.ueberlebensrate AS tpopkontrueberleb,
  apflora.tpopkontr.vitalitaet AS tpopkontrvitalitaet,
  apflora.tpop_entwicklung_werte.text AS tpopkontrentwicklung,
  apflora.tpopkontr.ursachen AS tpopkontrursach,
  apflora.tpopkontr.erfolgsbeurteilung AS tpopkontrurteil,
  apflora.tpopkontr.umsetzung_aendern AS tpopkontraendums,
  apflora.tpopkontr.kontrolle_aendern AS tpopkontraendkontr,
  apflora.tpopkontr.lr_delarze AS tpopkontrleb,
  apflora.tpopkontr.flaeche AS tpopkontrflaeche,
  apflora.tpopkontr.lr_umgebung_delarze AS tpopkontrlebumg,
  apflora.tpopkontr.vegetationstyp AS tpopkontrvegtyp,
  apflora.tpopkontr.konkurrenz AS tpopkontrkonkurrenz,
  apflora.tpopkontr.moosschicht AS tpopkontrmoosschicht,
  apflora.tpopkontr.krautschicht AS tpopkontrkrautschicht,
  apflora.tpopkontr.strauchschicht AS tpopkontrstrauchschicht,
  apflora.tpopkontr.baumschicht AS tpopkontrbaumschicht,
  apflora.tpopkontr.boden_typ AS tpopkontrbodentyp,
  apflora.tpopkontr.boden_kalkgehalt AS tpopkontrbodenkalkgehalt,
  apflora.tpopkontr.boden_durchlaessigkeit AS tpopkontrbodendurchlaessigkeit,
  apflora.tpopkontr.boden_humus AS tpopkontrbodenhumus,
  apflora.tpopkontr.boden_naehrstoffgehalt AS tpopkontrbodennaehrstoffgehalt,
  apflora.tpopkontr.boden_abtrag AS tpopkontrbodenabtrag,
  apflora.tpopkontr.wasserhaushalt AS tpopkontrwasserhaushalt,
  apflora.tpopkontr_idbiotuebereinst_werte.text AS tpopkontridealbiotopuebereinst,
  apflora.tpopkontr.flaeche_ueberprueft AS tpopkontruebflaeche,
  apflora.tpopkontr.plan_vorhanden AS tpopkontrplan,
  apflora.tpopkontr.deckung_vegetation AS tpopkontrveg,
  apflora.tpopkontr.deckung_nackter_boden AS tpopkontrnabo,
  apflora.tpopkontr.deckung_ap_art AS tpopkontruebpfl,
  apflora.tpopkontr.jungpflanzen_vorhanden AS tpopkontrjungpfljn,
  apflora.tpopkontr.vegetationshoehe_maximum AS tpopkontrveghoemax,
  apflora.tpopkontr.vegetationshoehe_mittel AS tpopkontrveghoemit,
  apflora.tpopkontr.gefaehrdung AS tpopkontrgefaehrdung,
  apflora.tpopkontr.changed::timestamp AS mutwann,
  apflora.tpopkontr.changed_by AS mutwer
FROM
  (((((apflora.ae_eigenschaften
  INNER JOIN
    apflora.ap
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontr_typ_werte
          ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
  LEFT JOIN
    apflora.tpopkontr_idbiotuebereinst_werte
    ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_tpopkontr_maxanzahl;
CREATE OR REPLACE VIEW apflora.v_tpopkontr_maxanzahl AS
SELECT
  apflora.tpopkontr.id,
  max(apflora.tpopkontrzaehl.anzahl) AS anzahl
FROM
  apflora.tpopkontr
  INNER JOIN
    apflora.tpopkontrzaehl
    ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
GROUP BY
  apflora.tpopkontr.id
ORDER BY
  apflora.tpopkontr.id;

-- v_exportevab_beob is in viewsGenerieren2 because dependant on v_tpopkontr_maxanzahl

DROP VIEW IF EXISTS apflora.v_exportevab_projekt CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_projekt AS
SELECT
  apflora.ap."ApGuid" AS "idProjekt",
  concat('AP Flora ZH: ', apflora.ae_eigenschaften.artname) AS "Name",
  CASE
    WHEN apflora.ap."ApJahr" IS NOT NULL
    THEN concat('01.01.', apflora.ap."ApJahr")
    ELSE to_char(current_date, 'DD.MM.YYYY')
  END AS "Eroeffnung",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  concat(
    'Aktionsplan: ',
    apflora.ap_bearbstand_werte.text,
    CASE
      WHEN apflora.ap."ApJahr" IS NOT NULL
      THEN concat('; Start im Jahr: ', apflora.ap."ApJahr")
      ELSE ''
    END,
    CASE
      WHEN apflora.ap."ApUmsetzung" IS NOT NULL
      THEN concat('; Stand Umsetzung: ', apflora.ap_umsetzung_werte.text)
      ELSE ''
    END,
    ''
  ) AS "Bemerkungen"
FROM
  (((apflora.ap
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
  INNER JOIN
    apflora.ae_eigenschaften
    ON apflora.ap."ApArtId" = apflora.ae_eigenschaften.taxid)
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop."PopHerkunft" = "popHerkunft".code)
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
GROUP BY
  apflora.ae_eigenschaften.artname,
  apflora.ap."ApGuid",
  apflora.ap."ApJahr",
  apflora.ap."ApUmsetzung",
  apflora.ap_bearbstand_werte.text,
  apflora.ap_umsetzung_werte.text;

DROP VIEW IF EXISTS apflora.v_exportevab_raum CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_raum AS
SELECT
  apflora.ap."ApGuid" AS "fkProjekt",
  apflora.pop."PopGuid" AS "idRaum",
  concat(
    apflora.pop."PopName",
    CASE
      WHEN apflora.pop."PopNr" IS NOT NULL
      THEN concat(' (Nr. ', apflora.pop."PopNr", ')')
      ELSE ''
    END
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  CASE
    WHEN apflora.pop."PopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        "popHerkunft".text,
        CASE
          WHEN apflora.pop."PopBekanntSeit" IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.pop."PopBekanntSeit"
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    LEFT JOIN
      apflora.pop_status_werte AS "popHerkunft"
      ON apflora.pop."PopHerkunft" = "popHerkunft".code)
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  -- ensure all idProjekt are contained in higher level
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
GROUP BY
  apflora.ap."ApGuid",
  apflora.pop."PopGuid",
  apflora.pop."PopName",
  apflora.pop."PopNr",
  apflora.pop."PopHerkunft",
  "popHerkunft".text,
  apflora.pop."PopBekanntSeit";

DROP VIEW IF EXISTS apflora.v_exportevab_ort CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_ort AS
SELECT
  -- include TPopGuid to enable later views to include only tpop included here
  apflora.tpop."TPopGuid",
  apflora.pop."PopGuid" AS "fkRaum",
  apflora.tpop."TPopGuid" AS "idOrt",
  substring(
    concat(
      apflora.tpop."TPopFlurname",
      CASE
        WHEN apflora.tpop."TPopNr" IS NOT NULL
        THEN concat(' (Nr. ', apflora.tpop."TPopNr", ')')
        ELSE ''
      END
    ) from 1 for 40
  ) AS "Name",
  to_char(current_date, 'DD.MM.YYYY') AS "Erfassungsdatum",
  '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::UUID AS "fkAutor",
  substring(max(apflora.evab_typologie."TYPO") from 1 for 9)::varchar(10) AS "fkLebensraumtyp",
  1 AS "fkGenauigkeitLage",
  1 AS "fkGeometryType",
  CASE
    WHEN apflora.tpop."TPopHoehe" IS NOT NULL
    THEN apflora.tpop."TPopHoehe"
    ELSE 0
  END AS "obergrenzeHoehe",
  4 AS "fkGenauigkeitHoehe",
  apflora.tpop."TPopXKoord" AS "X",
  apflora.tpop."TPopYKoord" AS "Y",
  substring(apflora.tpop."TPopGemeinde" from 1 for 25) AS "NOM_COMMUNE",
  substring(apflora.tpop."TPopFlurname" from 1 for 255) AS "DESC_LOCALITE",
  max(apflora.tpopkontr.lr_umgebung_delarze) AS "ENV",
  CASE
    WHEN apflora.tpop."TPopHerkunft" IS NOT NULL
    THEN
      concat(
        'Status: ',
        apflora.pop_status_werte.text,
        CASE
          WHEN apflora.tpop."TPopBekanntSeit" IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.tpop."TPopBekanntSeit"
            )
          ELSE ''
        END
      )
    ELSE ''
  END AS "Bemerkungen"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.tpop."TPopHerkunft" = apflora.pop_status_werte.code)
      INNER JOIN
        (((apflora.tpopkontr
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        LEFT JOIN apflora.evab_typologie
          ON apflora.tpopkontr.lr_delarze = apflora.evab_typologie."TYPO")
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
GROUP BY
  apflora.pop."PopGuid",
  apflora.tpop."TPopGuid",
  apflora.tpop."TPopNr",
  apflora.tpop."TPopBekanntSeit",
  apflora.tpop."TPopFlurname",
  apflora.tpop."TPopHerkunft",
  apflora.pop_status_werte.text,
  apflora.tpop."TPopHoehe",
  apflora.tpop."TPopXKoord",
  apflora.tpop."TPopYKoord",
  apflora.tpop."TPopGemeinde",
  apflora.tpop."TPopFlurname";

DROP VIEW IF EXISTS apflora.v_kontrzaehl_anzproeinheit;
CREATE OR REPLACE VIEW apflora.v_kontrzaehl_anzproeinheit AS
SELECT
  apflora.ae_eigenschaften.taxid AS "ApArtId",
  apflora.ae_eigenschaften.artname AS "AP Art",
  apflora.ap_bearbstand_werte.text AS "AP Status",
  apflora.ap."ApJahr" AS "AP Start im Jahr",
  apflora.ap_umsetzung_werte.text AS "AP Stand Umsetzung",
  "tblAdresse_1"."AdrName" AS "AP verantwortlich",
  apflora.pop."PopId",
  apflora.pop."PopGuid" AS "Pop Guid",
  apflora.pop."PopNr" AS "Pop Nr",
  apflora.pop."PopName" AS "Pop Name",
  apflora.pop_status_werte.text AS "Pop Herkunft",
  apflora.pop."PopBekanntSeit" AS "Pop bekannt seit",
  apflora.tpop."TPopId" AS "TPop ID",
  apflora.tpop."TPopGuid" AS "TPop Guid",
  apflora.tpop."TPopNr" AS "TPop Nr",
  apflora.tpop."TPopGemeinde" AS "TPop Gemeinde",
  apflora.tpop."TPopFlurname" AS "TPop Flurname",
  "tpopHerkunft".text AS "TPop Status",
  apflora.tpop."TPopBekanntSeit" AS "TPop bekannt seit",
  apflora.tpop."TPopHerkunftUnklar" AS "TPop Status unklar",
  apflora.tpop."TPopHerkunftUnklarBegruendung" AS "TPop Begruendung fuer unklaren Status",
  apflora.tpop."TPopXKoord" AS "TPop X-Koordinaten",
  apflora.tpop."TPopYKoord" AS "TPop Y-Koordinaten",
  apflora.tpop."TPopRadius" AS "TPop Radius m",
  apflora.tpop."TPopHoehe" AS "TPop Hoehe",
  apflora.tpop."TPopExposition" AS "TPop Exposition",
  apflora.tpop."TPopKlima" AS "TPop Klima",
  apflora.tpop."TPopNeigung" AS "TPop Hangneigung",
  apflora.tpop."TPopBeschr" AS "TPop Beschreibung",
  apflora.tpop."TPopKatNr" AS "TPop Kataster-Nr",
  apflora.tpop."TPopApBerichtRelevant" AS "TPop fuer AP-Bericht relevant",
  apflora.tpop."TPopEigen" AS "TPop EigentuemerIn",
  apflora.tpop."TPopKontakt" AS "TPop Kontakt vor Ort",
  apflora.tpop."TPopNutzungszone" AS "TPop Nutzungszone",
  apflora.tpop."TPopBewirtschafterIn" AS "TPop BewirtschafterIn",
  apflora.tpop."TPopBewirtschaftung" AS "TPop Bewirtschaftung",
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id AS "Kontr id",
  apflora.tpopkontr.jahr AS "Kontr Jahr",
  apflora.tpopkontr.datum AS "Kontr Datum",
  apflora.tpopkontr_typ_werte."DomainTxt" AS "Kontr Typ",
  apflora.adresse."AdrName" AS "Kontr BearbeiterIn",
  apflora.tpopkontr.ueberlebensrate AS "Kontr Ueberlebensrate",
  apflora.tpopkontr.vitalitaet AS "Kontr Vitalitaet",
  apflora.tpop_entwicklung_werte.text AS "Kontr Entwicklung",
  apflora.tpopkontr.ursachen AS "Kontr Ursachen",
  apflora.tpopkontr.erfolgsbeurteilung AS "Kontr Erfolgsbeurteilung",
  apflora.tpopkontr.umsetzung_aendern AS "Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.tpopkontr.kontrolle_aendern AS "Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.tpop."TPopXKoord" AS "Kontr X-Koord",
  apflora.tpop."TPopYKoord" AS "Kontr Y-Koord",
  apflora.tpopkontr.bemerkungen AS "Kontr Bemerkungen",
  apflora.tpopkontr.lr_delarze AS "Kontr Lebensraum Delarze",
  apflora.tpopkontr.lr_umgebung_delarze AS "Kontr angrenzender Lebensraum Delarze",
  apflora.tpopkontr.vegetationstyp AS "Kontr Vegetationstyp",
  apflora.tpopkontr.konkurrenz AS "Kontr Konkurrenz",
  apflora.tpopkontr.moosschicht AS "Kontr Moosschicht",
  apflora.tpopkontr.krautschicht AS "Kontr Krautschicht",
  apflora.tpopkontr.strauchschicht AS "Kontr Strauchschicht",
  apflora.tpopkontr.baumschicht AS "Kontr Baumschicht",
  apflora.tpopkontr.boden_typ AS "Kontr Bodentyp",
  apflora.tpopkontr.boden_kalkgehalt AS "Kontr Boden Kalkgehalt",
  apflora.tpopkontr.boden_durchlaessigkeit AS "Kontr Boden Durchlaessigkeit",
  apflora.tpopkontr.boden_humus AS "Kontr Boden Humusgehalt",
  apflora.tpopkontr.boden_naehrstoffgehalt AS "Kontr Boden Naehrstoffgehalt",
  apflora.tpopkontr.boden_abtrag AS "Kontr Oberbodenabtrag",
  apflora.tpopkontr.wasserhaushalt AS "Kontr Wasserhaushalt",
  apflora.tpopkontr_idbiotuebereinst_werte.text AS "Kontr Uebereinstimmung mit Idealbiotop",
  apflora.tpopkontr.handlungsbedarf AS "Kontr Handlungsbedarf",
  apflora.tpopkontr.flaeche_ueberprueft AS "Kontr Ueberpruefte Flaeche",
  apflora.tpopkontr.flaeche AS "Kontr Flaeche der Teilpopulation m2",
  apflora.tpopkontr.plan_vorhanden AS "Kontr auf Plan eingezeichnet",
  apflora.tpopkontr.deckung_vegetation AS "Kontr Deckung durch Vegetation",
  apflora.tpopkontr.deckung_nackter_boden AS "Kontr Deckung nackter Boden",
  apflora.tpopkontr.deckung_ap_art AS "Kontr Deckung durch ueberpruefte Art",
  apflora.tpopkontr.jungpflanzen_vorhanden AS "Kontr auch junge Pflanzen",
  apflora.tpopkontr.vegetationshoehe_maximum AS "Kontr maximale Veg-hoehe cm",
  apflora.tpopkontr.vegetationshoehe_mittel AS "Kontr mittlere Veg-hoehe cm",
  apflora.tpopkontr.gefaehrdung AS "Kontr Gefaehrdung",
  apflora.tpopkontr.changed AS "Kontrolle zuletzt geaendert",
  apflora.tpopkontr.changed_by AS "Kontrolle zuletzt geaendert von",
  apflora.tpopkontrzaehl.id AS "Zaehlung id",
  apflora.tpopkontrzaehl_einheit_werte.text AS "Zaehlung einheit",
  apflora.tpopkontrzaehl_methode_werte.text AS "Zaehlung Methode",
  apflora.tpopkontrzaehl.anzahl AS "Zaehlung Anzahl"
FROM
  apflora.ae_eigenschaften
  INNER JOIN
    ((((apflora.ap
    LEFT JOIN
      apflora.adresse AS "tblAdresse_1"
      ON apflora.ap."ApBearb" = "tblAdresse_1"."AdrId")
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap."ApStatus" = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte.code)
    INNER JOIN
      ((apflora.pop
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = apflora.pop_status_werte.code)
      INNER JOIN
        ((apflora.tpop
        LEFT JOIN
          apflora.pop_status_werte AS "tpopHerkunft"
          ON "tpopHerkunft".code = apflora.tpop."TPopHerkunft")
        INNER JOIN
          (((((apflora.tpopkontr
          LEFT JOIN
            apflora.tpopkontr_idbiotuebereinst_werte
            ON apflora.tpopkontr.idealbiotop_uebereinstimmung = apflora.tpopkontr_idbiotuebereinst_werte.code)
          LEFT JOIN
            apflora.tpopkontr_typ_werte
            ON apflora.tpopkontr.typ = apflora.tpopkontr_typ_werte."DomainTxt")
          LEFT JOIN
            apflora.adresse
            ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON apflora.tpopkontr.entwicklung = apflora.tpop_entwicklung_werte.code)
          LEFT JOIN
            ((apflora.tpopkontrzaehl
            LEFT JOIN
              apflora.tpopkontrzaehl_einheit_werte
              ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
            LEFT JOIN
              apflora.tpopkontrzaehl_methode_werte
              ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
            ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
          ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
        ON apflora.pop."PopId" = apflora.tpop."PopId")
      ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
    ON apflora.ae_eigenschaften.taxid = apflora.ap."ApArtId"
WHERE
  apflora.ae_eigenschaften.taxid > 150
ORDER BY
  apflora.ae_eigenschaften.artname,
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr,
  apflora.tpopkontr.datum;

DROP VIEW IF EXISTS apflora.v_exportevab_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_exportevab_beob AS
SELECT
  apflora.tpopkontr.zeit_id AS "fkZeitpunkt",
  apflora.tpopkontr.id AS "idBeobachtung",
  -- TODO: should EvabIdPerson be real uuid?
  COALESCE(apflora.adresse."EvabIdPerson", '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::uuid) AS fkAutor,
  apflora.ap."ApArtId" AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  /*
  Status in EvAB (offizielle Ansiedlung / inoffiziell):
  - Status ist ursprünglich (< 200):
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
  */
   CASE
    WHEN apflora.tpop."TPopHerkunft" < 200 THEN 4
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpopkontr.tpop_id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= apflora.tpopkontr.jahr
    ) THEN 6
    WHEN apflora.tpop."TPopHerkunftUnklar" = 1 THEN 3
    ELSE 5
  END AS "fkAAINTRODUIT",
  /*
  Präsenz:
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr erloschen meldet:
    2 (erloschen/zerstört)
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr nicht erloschen meldet:
    3 (nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit))
  - sonst
    1 (vorhanden)
  */
  CASE
    WHEN (
      apflora.v_tpopkontr_maxanzahl.anzahl = 0
      AND EXISTS (
        SELECT
          tpop_id
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber.tpop_id = apflora.tpopkontr.tpop_id
          AND apflora.tpopber.entwicklung = 8
          AND apflora.tpopber.jahr = apflora.tpopkontr.jahr
      )
    ) THEN 2
    WHEN apflora.v_tpopkontr_maxanzahl.anzahl = 0 THEN 3
    ELSE 1
  END AS "fkAAPRESENCE",
  apflora.tpopkontr.gefaehrdung AS "MENACES",
  substring(apflora.tpopkontr.vitalitaet from 1 for 200) AS "VITALITE_PLANTE",
  substring(apflora.tpop."TPopBeschr" from 1 for 244) AS "STATION",
  /*
   * Zählungen auswerten für ABONDANCE
   */
  substring(
    concat(
      'Anzahlen: ',
      array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', '),
      ', Zaehleinheiten: ',
      string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', '),
      ', Methoden: ',
      string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ')
      )
    from 1 for 160
  ) AS "ABONDANCE",
  'C'::TEXT AS "EXPERTISE_INTRODUIT",
  /*
   * AP-Verantwortliche oder topos als EXPERTISE_INTRODUITE_NOM setzen
   */
  CASE
    WHEN "tblAdresse_2"."EvabIdPerson" IS NOT NULL
    THEN "tblAdresse_2"."AdrName"
    ELSE 'topos Marti & Müller AG Zürich'
  END AS "EXPERTISE_INTRODUITE_NOM"
FROM
  (apflora.ap
  LEFT JOIN
    apflora.adresse AS "tblAdresse_2"
    ON apflora.ap."ApBearb" = "tblAdresse_2"."AdrId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop."TPopGuid" IN (SELECT "idOrt" FROM apflora.v_exportevab_ort)
  AND apflora.tpopkontr.zeit_id IN (SELECT "idZeitpunkt" FROM apflora.v_exportevab_zeit)
GROUP BY
  apflora.tpopkontr.zeit_id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  apflora.v_tpopkontr_maxanzahl.anzahl,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop."TPopBeschr",
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";


DROP VIEW IF EXISTS apflora.v_tpop_kontrjahrundberjahrundmassnjahr;
CREATE OR REPLACE VIEW apflora.v_tpop_kontrjahrundberjahrundmassnjahr AS
SELECT
  apflora.tpop."TPopId",
  apflora.tpopber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopber ON apflora.tpop."TPopId" = apflora.tpopber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopmassnber.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN
    apflora.tpopmassnber
    ON apflora.tpop."TPopId" = apflora.tpopmassnber.tpop_id
UNION DISTINCT SELECT
  apflora.tpop."TPopId",
  apflora.tpopkontr.jahr AS "Jahr"
FROM
  apflora.tpop
  INNER JOIN apflora.tpopkontr ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id
ORDER BY
  "Jahr";

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.jahr IS NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnebearb;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Kontrolle (id): ', apflora.tpopkontr.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.bearbeiter IS NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.id;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnejahr;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnejahr AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Jahr:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (id): ', apflora.tpopkontr.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.jahr IS NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnebearb;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnebearb AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne BearbeiterIn:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (id): ', apflora.tpopkontr.id)]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontr.bearbeiter IS NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.bearbeiter;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnetyp;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnetyp AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Typ:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  (
    apflora.tpopkontr.typ IS NULL
    OR apflora.tpopkontr.typ = 'Erfolgskontrolle'
  )
  AND apflora.tpopkontr.jahr IS NOT NULL
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Feldkontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr.id,
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontr_ohnezaehlung AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Freiwilligen-Kontrolle ohne Zaehlung:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        LEFT JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
GROUP BY
  apflora.ap."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  apflora.tpopkontr.id,
  apflora.tpopkontrzaehl.id
HAVING
  apflora.tpopkontrzaehl.id IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.ap."ApArtId",
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneeinheit;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneeinheit;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneeinheit AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Zaehleinheit (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.einheit IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohnemethode;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohnemethode;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohnemethode AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Methode (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.methode IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneanzahl;
CREATE OR REPLACE VIEW apflora.v_qk2_feldkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Feldkontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Feld-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ <> 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneanzahl;
CREATE OR REPLACE VIEW apflora.v_qk2_freiwkontrzaehlung_ohneanzahl AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'Zaehlung ohne Anzahl (Freiwilligen-Kontrolle):'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId", 'Freiwilligen-Kontrollen', apflora.tpopkontr.id, 'Zählungen', apflora.tpopkontrzaehl.id]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr"), concat('Feld-Kontrolle (Jahr): ', apflora.tpopkontr.jahr), concat('Zählung (id): ', apflora.tpopkontrzaehl.id)]::text[] AS text,
  apflora.tpopkontr.jahr AS "Berichtjahr"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopkontr
        INNER JOIN
          apflora.tpopkontrzaehl
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpopkontrzaehl.anzahl IS NULL
  AND apflora.tpopkontr.jahr IS NOT NULL
  AND apflora.tpopkontr.typ = 'Freiwilligen-Erfolgskontrolle'
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr",
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.ap."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "Ansaatversuch", bei denen in der letzten Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.tpop."PopId" = apflora.pop."PopId"
    ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" = 201
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      (apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
      INNER JOIN
        apflora.v_tpopkontr_letzteid
        ON
          (
            apflora.v_tpopkontr_letzteid."TPopId" = apflora.tpopkontr.tpop_id
            AND apflora.v_tpopkontr_letzteid."MaxTPopKontrId" = apflora.tpopkontr.id::text
          )
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  );

DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl AS
SELECT DISTINCT
  apflora.projekt."ProjId",
  apflora.pop."ApArtId",
  apflora.pop."PopId",
  apflora.tpop."TPopId",
  'Teilpopulation mit Status "potentieller Wuchs-/Ansiedlungsort", bei denen in einer Kontrolle eine Anzahl festgestellt wurde:'::text AS hw,
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS url,
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.projekt
  INNER JOIN
    apflora.ap
    INNER JOIN
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    ON apflora.projekt."ProjId" = apflora.ap."ProjId"
WHERE
  apflora.tpop."TPopHerkunft" = 300
  AND apflora.tpop."TPopId" IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
ORDER BY
  apflora.pop."PopId",
  apflora.tpop."TPopId";

DROP VIEW IF EXISTS apflora.v_tpop_anzkontrinklletzter CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_anzkontrinklletzter AS
SELECT
  apflora.v_tpop_letzteKontrId."TPopId",
  apflora.v_tpop."ApArtId",
  apflora.v_tpop."Familie",
  apflora.v_tpop."AP Art",
  apflora.v_tpop."AP Status",
  apflora.v_tpop."AP Start im Jahr",
  apflora.v_tpop."AP Stand Umsetzung",
  apflora.v_tpop."AP verantwortlich",
  apflora.v_tpop."PopId",
  apflora.v_tpop."Pop Guid",
  apflora.v_tpop."Pop Nr",
  apflora.v_tpop."Pop Name",
  apflora.v_tpop."Pop Status",
  apflora.v_tpop."Pop bekannt seit",
  apflora.v_tpop."Pop Status unklar",
  apflora.v_tpop."Pop Begruendung fuer unklaren Status",
  apflora.v_tpop."Pop X-Koordinaten",
  apflora.v_tpop."Pop Y-Koordinaten",
  apflora.v_tpop."TPop ID",
  apflora.v_tpop."TPop Guid",
  apflora.v_tpop."TPop Nr",
  apflora.v_tpop."TPop Gemeinde",
  apflora.v_tpop."TPop Flurname",
  apflora.v_tpop."TPop Status",
  apflora.v_tpop."TPop bekannt seit",
  apflora.v_tpop."TPop Status unklar",
  apflora.v_tpop."TPop Begruendung fuer unklaren Status",
  apflora.v_tpop."TPop X-Koordinaten",
  apflora.v_tpop."TPop Y-Koordinaten",
  apflora.v_tpop."TPop Radius (m)",
  apflora.v_tpop."TPop Hoehe",
  apflora.v_tpop."TPop Exposition",
  apflora.v_tpop."TPop Klima",
  apflora.v_tpop."TPop Hangneigung",
  apflora.v_tpop."TPop Beschreibung",
  apflora.v_tpop."TPop Kataster-Nr",
  apflora.v_tpop."TPop fuer AP-Bericht relevant",
  apflora.v_tpop."TPop EigentuemerIn",
  apflora.v_tpop."TPop Kontakt vor Ort",
  apflora.v_tpop."TPop Nutzungszone",
  apflora.v_tpop."TPop BewirtschafterIn",
  apflora.v_tpop."TPop Bewirtschaftung",
  apflora.v_tpop."Teilpopulation zuletzt geaendert",
  apflora.v_tpop."Teilpopulation zuletzt geaendert von",
  apflora.v_tpop_letzteKontrId."AnzTPopKontr" AS "TPop Anzahl Kontrollen",
  apflora.v_tpopkontr.id,
  apflora.v_tpopkontr."Kontr Jahr",
  apflora.v_tpopkontr."Kontr Datum",
  apflora.v_tpopkontr."Kontr Typ",
  apflora.v_tpopkontr."Kontr BearbeiterIn",
  apflora.v_tpopkontr."Kontr Ueberlebensrate",
  apflora.v_tpopkontr."Kontr Vitalitaet",
  apflora.v_tpopkontr."Kontr Entwicklung",
  apflora.v_tpopkontr."Kontr Ursachen",
  apflora.v_tpopkontr."Kontr Erfolgsbeurteilung",
  apflora.v_tpopkontr."Kontr Aenderungs-Vorschlaege Umsetzung",
  apflora.v_tpopkontr."Kontr Aenderungs-Vorschlaege Kontrolle",
  apflora.v_tpopkontr."Kontr X-Koord",
  apflora.v_tpopkontr."Kontr Y-Koord",
  apflora.v_tpopkontr."Kontr Bemerkungen",
  apflora.v_tpopkontr."Kontr Lebensraum Delarze",
  apflora.v_tpopkontr."Kontr angrenzender Lebensraum Delarze",
  apflora.v_tpopkontr."Kontr Vegetationstyp",
  apflora.v_tpopkontr."Kontr Konkurrenz",
  apflora.v_tpopkontr."Kontr Moosschicht",
  apflora.v_tpopkontr."Kontr Krautschicht",
  apflora.v_tpopkontr."Kontr Strauchschicht",
  apflora.v_tpopkontr."Kontr Baumschicht",
  apflora.v_tpopkontr."Kontr Bodentyp",
  apflora.v_tpopkontr."Kontr Boden Kalkgehalt",
  apflora.v_tpopkontr."Kontr Boden Durchlaessigkeit",
  apflora.v_tpopkontr."Kontr Boden Humusgehalt",
  apflora.v_tpopkontr."Kontr Boden Naehrstoffgehalt",
  apflora.v_tpopkontr."Kontr Oberbodenabtrag",
  apflora.v_tpopkontr."Kontr Wasserhaushalt",
  apflora.v_tpopkontr."Kontr Uebereinstimmung mit Idealbiotop",
  apflora.v_tpopkontr."Kontr Handlungsbedarf",
  apflora.v_tpopkontr."Kontr Ueberpruefte Flaeche",
  apflora.v_tpopkontr."Kontr Flaeche der Teilpopulation m2",
  apflora.v_tpopkontr."Kontr auf Plan eingezeichnet",
  apflora.v_tpopkontr."Kontr Deckung durch Vegetation",
  apflora.v_tpopkontr."Kontr Deckung nackter Boden",
  apflora.v_tpopkontr."Kontr Deckung durch ueberpruefte Art",
  apflora.v_tpopkontr."Kontr auch junge Pflanzen",
  apflora.v_tpopkontr."Kontr maximale Veg-hoehe cm",
  apflora.v_tpopkontr."Kontr mittlere Veg-hoehe cm",
  apflora.v_tpopkontr."Kontr Gefaehrdung",
  apflora.v_tpopkontr."Kontrolle zuletzt geaendert",
  apflora.v_tpopkontr."Kontrolle zuletzt geaendert von",
  apflora.v_tpopkontr."Zaehlungen Anzahlen",
  apflora.v_tpopkontr."Zaehlungen Einheiten",
  apflora.v_tpopkontr."Zaehlungen Methoden"
FROM
  (apflora.v_tpop_letzteKontrId
  LEFT JOIN
    apflora.v_tpopkontr
    ON apflora.v_tpop_letzteKontrId."MaxTPopKontrId" = apflora.v_tpopkontr.id)
  INNER JOIN
    apflora.v_tpop
    ON apflora.v_tpop_letzteKontrId."TPopId" = apflora.v_tpop."TPopId";


DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950;
CREATE OR REPLACE VIEW apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap."ProjId",
  apflora.ap."ApArtId",
  'erloschene Teilpopulation "Fuer AP-Bericht relevant" aber letzte Beobachtung vor 1950:' AS "hw",
  ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url",
  ARRAY[concat('Population (Nr.): ', apflora.pop."PopNr"), concat('Teil-Population (Nr.): ', apflora.tpop."TPopNr")]::text[] AS text
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  apflora.tpop."TPopHerkunft" IN (101, 202, 211)
  AND apflora.tpop."TPopApBerichtRelevant" = 1
  AND apflora.tpop."TPopId" NOT IN (
    SELECT DISTINCT
      apflora.tpopkontr.tpop_id
    FROM
      apflora.tpopkontr
      INNER JOIN
        apflora.tpopkontrzaehl
        ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id
    WHERE
      apflora.tpopkontr.typ NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontrzaehl.anzahl > 0
  )
  AND apflora.tpop."TPopId" IN (
    SELECT apflora.tpopbeob.tpop_id
    FROM
      apflora.tpopbeob
      INNER JOIN
        apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.tpopbeob.tpop_id = apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.id
    WHERE
      apflora.v_qk_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop."PopNr",
  apflora.tpop."TPopNr";

DROP VIEW IF EXISTS apflora.v_exportevab_beob;
CREATE OR REPLACE VIEW apflora.v_exportevab_beob AS
SELECT
  apflora.tpopkontr.zeit_id AS "fkZeitpunkt",
  apflora.tpopkontr.id AS "idBeobachtung",
  -- TODO: should EvabIdPerson be real uuid?
  COALESCE(apflora.adresse."EvabIdPerson", '{7C71B8AF-DF3E-4844-A83B-55735F80B993}'::uuid) AS fkAutor,
  apflora.ap."ApArtId" AS fkArt,
  18 AS fkArtgruppe,
  1 AS fkAA1,
  /*
  Status in EvAB (offizielle Ansiedlung / inoffiziell):
  - Status ist ursprünglich (< 200):
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
  */
   CASE
    WHEN apflora.tpop."TPopHerkunft" < 200 THEN 4
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = apflora.tpopkontr.tpop_id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= apflora.tpopkontr.jahr
    ) THEN 6
    WHEN apflora.tpop."TPopHerkunftUnklar" = 1 THEN 3
    ELSE 5
  END AS "fkAAINTRODUIT",
  /*
  Präsenz:
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr erloschen meldet:
    2 (erloschen/zerstört)
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr nicht erloschen meldet:
    3 (nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit))
  - sonst
    1 (vorhanden)
  */
  CASE
    WHEN (
      apflora.v_tpopkontr_maxanzahl.anzahl = 0
      AND EXISTS (
        SELECT
          tpop_id
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber.tpop_id = apflora.tpopkontr.tpop_id
          AND apflora.tpopber.entwicklung = 8
          AND apflora.tpopber.jahr = apflora.tpopkontr.jahr
      )
    ) THEN 2
    WHEN apflora.v_tpopkontr_maxanzahl.anzahl = 0 THEN 3
    ELSE 1
  END AS "fkAAPRESENCE",
  apflora.tpopkontr.gefaehrdung AS "MENACES",
  substring(apflora.tpopkontr.vitalitaet from 1 for 200) AS "VITALITE_PLANTE",
  substring(apflora.tpop."TPopBeschr" from 1 for 244) AS "STATION",
  /*
   * Zählungen auswerten für ABONDANCE
   */
  substring(
    concat(
      'Anzahlen: ',
      array_to_string(array_agg(apflora.tpopkontrzaehl.anzahl), ', '),
      ', Zaehleinheiten: ',
      string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', '),
      ', Methoden: ',
      string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ')
      )
    from 1 for 160
  ) AS "ABONDANCE",
  'C'::TEXT AS "EXPERTISE_INTRODUIT",
  /*
   * AP-Verantwortliche oder topos als EXPERTISE_INTRODUITE_NOM setzen
   */
  CASE
    WHEN "tblAdresse_2"."EvabIdPerson" IS NOT NULL
    THEN "tblAdresse_2"."AdrName"
    ELSE 'topos Marti & Müller AG Zürich'
  END AS "EXPERTISE_INTRODUITE_NOM"
FROM
  (apflora.ap
  LEFT JOIN
    apflora.adresse AS "tblAdresse_2"
    ON apflora.ap."ApBearb" = "tblAdresse_2"."AdrId")
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (((apflora.tpopkontr
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse."AdrId")
        INNER JOIN
          apflora.v_tpopkontr_maxanzahl
          ON apflora.v_tpopkontr_maxanzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          ((apflora.tpopkontrzaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON apflora.tpopkontrzaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code)
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON apflora.tpopkontrzaehl.methode = apflora.tpopkontrzaehl_methode_werte.code)
          ON apflora.tpopkontr.id = apflora.tpopkontrzaehl.tpopkontr_id)
        ON apflora.tpop."TPopId" = apflora.tpopkontr.tpop_id)
      ON apflora.pop."PopId" = apflora.tpop."PopId")
    ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
WHERE
  -- keine Testarten
  apflora.ap."ApArtId" > 150
  AND apflora.ap."ApArtId" < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop."TPopXKoord" IS NOT NULL
  AND apflora.tpop."TPopYKoord" IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop."TPopHerkunft" <> 201
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop."TPopBekanntSeit" IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop."TPopHerkunft" IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop."TPopBekanntSeit") > 5
  )
  AND apflora.tpop."TPopFlurname" IS NOT NULL
  AND apflora.ap."ApGuid" IN (Select "idProjekt" FROM apflora.v_exportevab_projekt)
  AND apflora.pop."PopGuid" IN (SELECT "idRaum" FROM apflora.v_exportevab_raum)
  AND apflora.tpop."TPopGuid" IN (SELECT "idOrt" FROM apflora.v_exportevab_ort)
  AND apflora.tpopkontr.zeit_id IN (SELECT "idZeitpunkt" FROM apflora.v_exportevab_zeit)
GROUP BY
  apflora.tpopkontr.zeit_id,
  apflora.tpopkontr.tpop_id,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr,
  apflora.adresse."EvabIdPerson",
  apflora.ap."ApArtId",
  "fkAAINTRODUIT",
  apflora.v_tpopkontr_maxanzahl.anzahl,
  apflora.tpopkontr.gefaehrdung,
  apflora.tpopkontr.vitalitaet,
  apflora.tpop."TPopBeschr",
  "tblAdresse_2"."EvabIdPerson",
  "tblAdresse_2"."AdrName";

DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
SELECT
  apflora.tpopber.tpop_id AS "TPopId",
  apflora.v_tpopber_letzteid."AnzTPopBer",
  apflora.tpopber.id,
  apflora.tpopber.jahr AS "TPopBer Jahr",
  apflora.tpop_entwicklung_werte.text AS "TPopBer Entwicklung",
  apflora.tpopber.bemerkungen AS "TPopBer Bemerkungen",
  apflora.tpopber.changed AS "TPopBer MutWann",
  apflora.tpopber.changed_by AS "TPopBer MutWer"
FROM
  apflora.v_tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (apflora.v_tpopber_letzteid."MaxTPopBerId" = apflora.tpopber.id)
      AND (apflora.v_tpopber_letzteid."TPopId" = apflora.tpopber.tpop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code;