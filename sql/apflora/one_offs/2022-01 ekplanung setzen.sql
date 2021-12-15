-- view to list for what tpop to set ekfrequenz for tpops where not yet set
DROP VIEW IF EXISTS apflora.v_tpop_ekfrequenz_to_set CASCADE;

CREATE OR REPLACE VIEW apflora.v_tpop_ekfrequenz_to_set AS
with letzte_kontrolle AS (
  SELECT DISTINCT ON (apflora.tpop.id)
    apflora.tpop.id AS tpop_id,
    apflora.tpopkontr.jahr,
    apflora.tpopkontrzaehl.anzahl
  FROM
    apflora.tpopkontrzaehl
    INNER JOIN apflora.tpopkontr
    INNER JOIN apflora.tpop
    INNER JOIN apflora.pop
    INNER JOIN apflora.ap
    -- nur AP's berücksichtigen, bei denen eine EK-Zähleinheit als zielrelevant definiert wurde
    INNER JOIN apflora.ekzaehleinheit ON apflora.ap.id = apflora.ekzaehleinheit.ap_id
      AND apflora.ekzaehleinheit.zielrelevant = TRUE ON apflora.ap.id = apflora.pop.ap_id ON apflora.pop.id = apflora.tpop.pop_id ON apflora.tpop.id = apflora.tpopkontr.tpop_id ON apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
  WHERE
    -- nur Kontrollen mit Jahr berücksichtigen
    apflora.tpopkontr.jahr IS NOT NULL
    -- nur Zählungen mit zielrelevanter Einheit berücksichtigen
    AND apflora.tpopkontrzaehl.einheit = (
      SELECT
        code
      FROM
        apflora.tpopkontrzaehl_einheit_werte
      WHERE
        id = apflora.ekzaehleinheit.zaehleinheit_id)
      -- nur Zählungen mit Anzahl berücksichtigen
      AND apflora.tpopkontrzaehl.anzahl IS NOT NULL
    ORDER BY
      apflora.tpop.id,
      apflora.tpopkontr.jahr DESC,
      apflora.tpopkontr.datum DESC
),
letzte_ansiedlung AS (
  -- TODO:
  -- if tpop.status === 201 (Ansaatversuch): choose first ansaat
  -- else: choose last anpflanzung
  SELECT DISTINCT ON (apflora.tpop.id)
    apflora.tpop.id AS tpop_id,
    apflora.tpopmassn.jahr
  FROM
    apflora.tpopmassn
    INNER JOIN apflora.tpopmassn_typ_werte ON apflora.tpopmassn_typ_werte.code = apflora.tpopmassn.typ
    INNER JOIN apflora.tpop ON apflora.tpop.id = apflora.tpopmassn.tpop_id
  WHERE
    -- nur Massnahmen mit Jahr berücksichtigen
    apflora.tpopmassn.jahr IS NOT NULL
    -- nur Massnahmen vom Typ Ansiedlung berücksichtigen
    AND apflora.tpopmassn.typ > 0
    AND apflora.tpopmassn.typ < 4
  ORDER BY
    apflora.tpop.id,
    apflora.tpopmassn.jahr DESC,
    apflora.tpopmassn.datum DESC
),
tpop_plus AS (
  SELECT
    tpop.id AS tpop_id,
    lk.jahr,
    lk.anzahl AS letzte_anzahl,
    CASE WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl = 0 -- erloschen? (0 Ind.)
      THEN
      'GD'
    WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl > 0
      AND lk.anzahl < 20 -- stark gefährdet (< 20 Ind.)
      THEN
      'GA'
    WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl > 20 -- mittel gefährdet (> 20 Ind.)
      AND lk.anzahl <= 500 THEN
      'GB'
    WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl > 500 -- wenig gefährdet (> 500 Ind.)
      THEN
      'GC'
    WHEN pop.status = 200
      AND tpop.status = 200 THEN
      'SA'
    WHEN pop.status = 100
      AND tpop.status = 200 THEN
      'SB'
      -- when pop.status in (100, 200) and tpop.status = 200 then 'D'
      -- dieser Fall kann hier nicht von obigen zwei (SA, SB) unterschieden werden, oder?
    WHEN tpop.status = 201 THEN
      'A'
    ELSE
      NULL
    END AS ekfrequenz_code,
    CASE WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl = 0 -- erloschen? (0 Ind.)
      THEN
      (
        SELECT
          id
        FROM
          apflora.ekfrequenz
        WHERE
          ap_id = ap.id
          AND code = 'GD')
    WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl > 0
      AND lk.anzahl < 20 -- stark gefährdet (< 20 Ind.)
      THEN
      (
        SELECT
          id
        FROM
          apflora.ekfrequenz
        WHERE
          ap_id = ap.id
          AND code = 'GA')
    WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl > 20 -- mittel gefährdet (> 20 Ind.)
      AND lk.anzahl <= 500 THEN
      (
        SELECT
          id
        FROM
          apflora.ekfrequenz
        WHERE
          ap_id = ap.id
          AND code = 'GB')
    WHEN pop.status = 100
      AND tpop.status = 100
      AND lk.anzahl > 500 -- wenig gefährdet (> 500 Ind.)
      THEN
      (
        SELECT
          id
        FROM
          apflora.ekfrequenz
        WHERE
          ap_id = ap.id
          AND code = 'GC')
    WHEN pop.status = 200
      AND tpop.status = 200 THEN
      (
        SELECT
          id
        FROM
          apflora.ekfrequenz
        WHERE
          ap_id = ap.id
          AND code = 'SA')
    WHEN pop.status = 100
      AND tpop.status = 200 THEN
      (
        SELECT
          id
        FROM
          apflora.ekfrequenz
        WHERE
          ap_id = ap.id
          AND code = 'SB')
        -- when pop.status in (100, 200) and tpop.status = 200 then 'D'
        -- dieser Fall kann hier nicht von obigen zwei (SA, SB) unterschieden werden, oder?
    WHEN tpop.status = 201 THEN
    (
      SELECT
        id
      FROM
        apflora.ekfrequenz
      WHERE
        ap_id = ap.id
        AND code = 'A')
    ELSE
      NULL
    END AS ekfrequenz
  FROM
    apflora.tpop tpop
    -- nur TPop berücksichtigen, für die eine letzte Anzahl berechnet wurde
    LEFT JOIN letzte_kontrolle lk ON lk.tpop_id = tpop.id
    -- nur TPop berücksichtigen, welche über Pop, AP und Taxonomie verfügen
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.ap ap
    INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id ON ap.id = pop.ap_id ON pop.id = tpop.pop_id
  WHERE
    -- nur TPop ohne ekfrequenz und startjahr berücksichtigen
    tpop.ekfrequenz IS NULL
    AND tpop.ekfrequenz_startjahr IS NULL
    -- nur TPop von AP's mit bearbeitung 'erstellt', 'in Bearbeitung' oder 'vorgesehen' berücksichtigen
    --and ap.bearbeitung < 4
    -- nur TPop, die nicht erloschen sind berücksichtigen
    AND tpop.status NOT IN (101, 202, 300)
    -- nur relevante TPop berücksichtigen
    AND tpop.apber_relevant = TRUE
    AND tax.taxid > 150
),
ap_with_ekfrequenz AS (
  SELECT DISTINCT
    pop.ap_id AS id
  FROM
    apflora.tpop tpop
    INNER JOIN apflora.pop pop ON tpop.pop_id = pop.id
  WHERE
    tpop.ekfrequenz IS NOT NULL
    -- Die AP-Liste ist ein bisschen kompliziert: weil einige künftig zu AP's werden sollen, sind es nicht _nur_ ap's
    AND pop.ap_id NOT IN ('6c52d11b-4f62-11e7-aebe-e30ba55051d8', '6c52d132-4f62-11e7-aebe-571f196500d9', '6c52d24e-4f62-11e7-aebe-4f55ce8d8aeb', '6c52d24f-4f62-11e7-aebe-9759f2114695', '6c52d251-4f62-11e7-aebe-239f844a5125', '6c52d256-4f62-11e7-aebe-8723d142869e'))
SELECT
  tax.artname,
  ap.id AS ap_id,
  pop.nr AS pop_nr,
  pop.status AS pop_status,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  tpop.status AS tpop_status,
  ekf.kontrolljahre_ab,
  -- ekfrequenz_startjahr depends on letze_kontrolle OR letzte_ansiedlung depending on kontrolljahre_ab
  CASE WHEN ekf.kontrolljahre_ab = 'ek' THEN
    tp.jahr
  WHEN ekf.kontrolljahre_ab = 'ansiedlung' THEN
    la.jahr
  ELSE
    NULL
  END AS ekfrequenz_startjahr,
  CASE WHEN ekf.kontrolljahre_ab = 'ek' THEN
    tp.letzte_anzahl
  ELSE
    NULL
  END AS letzte_anzahl,
  tp.ekfrequenz_code,
  tp.ekfrequenz
FROM
  apflora.tpop tpop
  -- nur TPop berücksichtigen, für die eine letzte Kontrolle berechnet wurde
  INNER JOIN tpop_plus tp
  INNER JOIN apflora.ekfrequenz ekf ON ekf.id = tp.ekfrequenz ON tp.tpop_id = tpop.id
  LEFT JOIN letzte_ansiedlung la ON la.tpop_id = tpop.id
  -- nur TPop berücksichtigen, welche über Pop, AP und Taxonomie verfügen
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON ap.art_id = tax.id
  -- nur ap's mit mindestens einer tpop mit ekfrequenz berücksichtigen
  -- UND: eine Liste von AP's ausschliessen (siehe def von ap_with_ekfrequenz)
  INNER JOIN ap_with_ekfrequenz ON ap_with_ekfrequenz.id = ap.id ON ap.id = pop.ap_id ON pop.id = tpop.pop_id
ORDER BY
  tax.artname,
  pop.nr,
  tpop.nr;

-- DO: if o.k. by Topos:
UPDATE
  apflora.tpop
SET
  ekfrequenz_startjahr = apflora.v_tpop_ekfrequenz_to_set.ekfrequenz_startjahr,
  ekfrequenz = apflora.v_tpop_ekfrequenz_to_set.ekfrequenz
FROM
  apflora.v_tpop_ekfrequenz_to_set
WHERE
  apflora.tpop.id = apflora.v_tpop_ekfrequenz_to_set.tpop_id;

-- Wäre es möglich, dass bei den dieses Jahr neu erloschenen Teilpopulationen die EK-Frequenz "nie" gesetzt wird?
-- Rebecca fragen, wenn ja: Wie bei 2021-01-11 ekplanung.sql machen
CREATE OR REPLACE VIEW apflora.v_tpop_ekfrequenz_to_set_nie AS...
