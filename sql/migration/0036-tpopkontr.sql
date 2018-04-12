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
-- TODO: restart postgrest and test app
-- TODO: update js and run this file on server
-- TODO: restart postgrest
-- TODO: CHECK zaehl: are they correct?
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