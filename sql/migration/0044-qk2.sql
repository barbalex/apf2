

drop FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer);
drop FUNCTION apflora.qk2_tpop_ohne_tpopber(apid uuid, berichtjahr integer);
drop FUNCTION apflora.qk2_pop_ohne_popmassnber(apid uuid, berichtjahr integer);
drop FUNCTION apflora.qk2_pop_ohne_popber(apid uuid, berichtjahr integer);
drop  FUNCTION apflora.correct_vornach_beginnap_stati(apid integer);

CREATE OR REPLACE FUNCTION apflora.qk_tpop_ohne_tpopber(apid uuid, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  -- 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap.proj_id,
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
ALTER FUNCTION apflora.qk_tpop_ohne_tpopber(apid uuid, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk_tpop_ohne_massnber(apid uuid, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id uuid, hw text, url text[], text text[]) AS
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
ALTER FUNCTION apflora.qk_tpop_ohne_massnber(apid uuid, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk_pop_ohne_popmassnber(apid uuid, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  -- 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  SELECT DISTINCT
    apflora.ap.proj_id,
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
ALTER FUNCTION apflora.qk_pop_ohne_popmassnber(apid uuid, berichtjahr integer)
  OWNER TO postgres;

CREATE OR REPLACE FUNCTION apflora.qk_pop_ohne_popber(apid uuid, berichtjahr integer)
  RETURNS table("ProjId" integer, ap_id uuid, hw text, url text[], text text[]) AS
  $$
  SELECT DISTINCT
    apflora.ap.proj_id,
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
ALTER FUNCTION apflora.qk_pop_ohne_popber(apid uuid, berichtjahr integer)
  OWNER TO postgres;


DROP VIEW IF EXISTS apflora.v_qk2_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberaktuell CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletzterpopberaktuell CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_popnrtpopnrmehrdeutig CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_popnrmehrdeutig CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnekoord CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopnr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopname CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnepopstatus CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mitstatusunklarohnebegruendung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpop CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnenr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneflurname CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnestatus CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnebekanntseit CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohneapberrelevant CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuspotentiellfuerapberrelevant CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusunklarohnebegruendung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_ohnekoordinaten CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnebearb CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_massn_ohnetyp CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_massnber_ohneerfbeurt CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnebearb CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnebearb CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnetyp CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontr_ohnezaehlung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_freiwkontr_ohnezaehlung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneeinheit CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneeinheit CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohnemethode CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohnemethode CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_feldkontrzaehlung_ohneanzahl CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_freiwkontrzaehlung_ohneanzahl CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpopber_ohneentwicklung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_popber_ohneentwicklung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_popber_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_popmassnber_ohneentwicklung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohneentwicklung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_zielber_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohnetyp CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_ziel_ohneziel CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnebeurteilung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_erfkrit_ohnekriterien CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnejahr CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnevergleichvorjahrgesamtziel CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_apber_ohnebeurteilung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_assozart_ohneart CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_koordentsprechenkeinertpop CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmitaktuellentpop CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchalletpoperloschen CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statusansaatversuchmittpopursprerloschen CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopaktuell CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenmittpopansaatversuch CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statusangesiedeltmittpopurspruenglich CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuspotwuchsortmittpopanders CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatusansaatversuchundzaehlungmitanzahl CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundzaehlungmitanzahl CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_mitstatuspotentiellundmassnansiedlung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_zunehmend_ohne_tpopber_zunehmend CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_abnehmend_ohne_tpopber_abnehmend CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_ohne_tpopber_erloschen CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_mit_ber_erloschen_und_tpopber_nicht_erloschen CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statusaktuellletztertpopbererloschen;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statusaktuellletzterpopbererloschen CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberzunehmend CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberzunehmend CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberstabil CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberstabil CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberabnehmend CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberabnehmend CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopberunsicher CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopberunsicher CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnetpopmitgleichemstatus CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status300tpopstatusanders CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status201tpopstatusunzulaessig CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status202tpopstatusanders CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status211tpopstatusunzulaessig CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status200tpopstatusunzulaessig CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status210tpopstatusunzulaessig CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_status101tpopstatusanders CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_statuserloschenletzterpopbererloschenmitansiedlung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_tpop_statuserloschenletztertpopbererloschenmitansiedlung CASCADE;
DROP VIEW IF EXISTS apflora.v_qk2_pop_ohnebekanntseit CASCADE;

CREATE OR REPLACE FUNCTION apflora.correct_vornach_beginnap_stati(apid uuid)
 RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER AS $$
 BEGIN

   -- diejenigen Werte setzen, welche in der Benutzeroberfläche angezeigt werden

   -- angesiedelt, erloschen/nicht etabliert
   UPDATE apflora.tpop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr <= apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr <= apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr > apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 211 -- angesiedelt vor Beginn AP, erloschen/nicht etabliert
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 202  -- angesiedelt nach Beginn AP, erloschen/nicht etabliert
       AND apflora.ap.start_jahr > apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   -- angesiedelt, aktuell
   UPDATE apflora.tpop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr IS NULL
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr <= apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 200  -- angesiedelt nach Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 210 -- angesiedelt vor Beginn AP, aktuell
       AND apflora.ap.start_jahr <= apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.tpop
   SET status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       tpop.id
     FROM
       apflora.tpop
       INNER JOIN apflora.pop
       ON apflora.tpop.pop_id = apflora.pop.id
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.tpop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND apflora.ap.start_jahr > apflora.tpop.bekannt_seit
       AND apflora.ap.id = $1
   );

   UPDATE apflora.pop
   SET status = 210 -- angesiedelt vor Beginn AP, aktuell
   WHERE id IN (
     SELECT
       pop.id
     FROM
       apflora.pop
         INNER JOIN apflora.ap
         ON apflora.pop.ap_id = apflora.ap.id
     WHERE
       apflora.pop.status = 200  -- angesiedelt nach Beginn AP, aktuell
       AND apflora.ap.start_jahr > apflora.pop.bekannt_seit
       AND apflora.ap.id = $1
   );

 END;
 $$;

ALTER FUNCTION apflora.correct_vornach_beginnap_stati(apid uuid)
   OWNER TO postgres;
