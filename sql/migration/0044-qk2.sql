

drop FUNCTION apflora.qk2_tpop_ohne_massnber(apid integer, berichtjahr integer);
drop FUNCTION apflora.qk2_tpop_ohne_tpopber(apid uuid, berichtjahr integer);
drop FUNCTION apflora.qk2_pop_ohne_popmassnber(apid uuid, berichtjahr integer);
drop FUNCTION apflora.qk2_pop_ohne_popber(apid uuid, berichtjahr integer);

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

DROP FUNCTION apflora.qk_tpop_ohne_massnber(apid integer, berichtjahr integer);
CREATE OR REPLACE FUNCTION apflora.qk_tpop_ohne_massnber(apid integer, berichtjahr integer)
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
ALTER FUNCTION apflora.qk_tpop_ohne_massnber(apid integer, berichtjahr integer)
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