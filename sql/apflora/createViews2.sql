/*
 * diese Views hängen von anderen ab, die in viewsGenerieren.sql erstellt werden
 * daher muss diese Date NACH viewsGenerieren.sql ausgeführt werden
 */


DROP VIEW IF EXISTS apflora.v_tpopber_mitletzterid CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpopber_mitletzterid AS
with tpopber_letzteid as (
  SELECT
    apflora.tpopkontr.tpop_id,
    (
      select id
      from apflora.tpopber
      where tpop_id = apflora.tpopkontr.tpop_id
      order by changed desc
      limit 1
    ) AS tpopber_letzte_id,
    count(apflora.tpopber.id) AS tpopber_anz
  FROM
    apflora.tpopkontr
    INNER JOIN
      apflora.tpopber
      ON apflora.tpopkontr.tpop_id = apflora.tpopber.tpop_id
  WHERE
    apflora.tpopkontr.typ NOT IN ('Ziel', 'Zwischenziel')
    AND apflora.tpopber.jahr IS NOT NULL
  GROUP BY
    apflora.tpopkontr.tpop_id
)
SELECT
  apflora.tpopber.tpop_id,
  tpopber_letzteid.tpopber_anz,
  apflora.tpopber.id,
  apflora.tpopber.jahr,
  apflora.tpop_entwicklung_werte.text AS entwicklung,
  apflora.tpopber.bemerkungen,
  apflora.tpopber.changed,
  apflora.tpopber.changed_by
FROM
  tpopber_letzteid
  INNER JOIN
    apflora.tpopber
    ON
      (tpopber_letzteid.tpopber_letzte_id = apflora.tpopber.id)
      AND (tpopber_letzteid.tpop_id = apflora.tpopber.tpop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.tpopber.entwicklung = tpop_entwicklung_werte.code;

DROP VIEW IF EXISTS apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950 AS
SELECT
  apflora.ap.proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.status IN (101, 202)
  AND apflora.tpop.apber_relevant = true
  AND apflora.tpop.id NOT IN (
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
  AND apflora.tpop.id IN (
    SELECT apflora.beob.tpop_id
    FROM
      apflora.beob
      INNER JOIN
        apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr
        ON apflora.beob.tpop_id = apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr.id
    WHERE
      apflora.v_q_tpop_erloschenundrelevantaberletztebeobvor1950_maxbeobjahr."MaxJahr" < 1950
  )
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;

DROP VIEW IF EXISTS apflora.v_q_pop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_statuserloschenletzterpopberaktuell AS
with letzter_popber as (
  SELECT distinct on (apflora.popber.pop_id)
    apflora.popber.pop_id,
    apflora.popber.jahr
  FROM
    apflora.popber
  WHERE
    apflora.popber.jahr IS NOT NULL
  order by
    apflora.popber.pop_id,
    apflora.popber.jahr desc
)
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id,
  apflora.pop.nr
FROM
  apflora.ap
    INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.popber
      INNER JOIN
        letzter_popber
        ON
          (letzter_popber.jahr = apflora.popber.jahr)
          AND (letzter_popber.pop_id = apflora.popber.pop_id))
      ON apflora.popber.pop_id = apflora.pop.id)
    INNER JOIN
      apflora.tpop
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.popber.entwicklung < 8
  AND apflora.pop.status  IN (101, 202)
  AND apflora.tpop.apber_relevant = true
ORDER BY
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_q_tpop_statuserloschenletzterpopberaktuell CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_statuserloschenletzterpopberaktuell AS
with tpop_letzterpopber as (
  SELECT distinct on (tpop_id)
    tpop_id,
    jahr AS tpopber_jahr
  FROM
    apflora.tpopber
  WHERE
    jahr IS NOT NULL
  order BY
    tpop_id,
    jahr desc
)
SELECT DISTINCT
  apflora.ap.proj_id,
  apflora.pop.ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.ap
    INNER JOIN
    apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          tpop_letzterpopber
          ON
            (tpop_letzterpopber.tpopber_jahr = apflora.tpopber.jahr)
            AND (tpop_letzterpopber.tpop_id = apflora.tpopber.tpop_id))
        ON apflora.tpopber.tpop_id = apflora.tpop.id)
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
WHERE
  apflora.tpopber.entwicklung < 8
  AND apflora.tpop.status IN (101, 202)
  AND apflora.tpop.id NOT IN (
    -- Ansiedlungen since apflora.tpopber.jahr
    SELECT
      apflora.tpopmassn.tpop_id
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn.tpop_id = apflora.tpop.id
      AND apflora.tpopmassn.typ BETWEEN 1 AND 3
      AND apflora.tpopmassn.jahr IS NOT NULL
      AND apflora.tpopmassn.jahr > apflora.tpopber.jahr
  );

DROP VIEW IF EXISTS apflora.v_popmassnber_anzmassn CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber_anzmassn AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.pop.id AS pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.pop.changed AS pop_changed,
  apflora.pop.changed_by AS pop_changed_by,
  apflora.popmassnber.id AS id,
  apflora.popmassnber.jahr AS jahr,
  tpopmassn_erfbeurt_werte.text AS entwicklung,
  apflora.popmassnber.bemerkungen AS bemerkungen,
  apflora.popmassnber.changed AS changed,
  apflora.popmassnber.changed_by AS changed_by,
  apflora.v_popmassnber_anzmassn0.anzahl_massnahmen
FROM
  ((((((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id)
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code)
  INNER JOIN
    apflora.popmassnber
      LEFT JOIN
      apflora.v_popmassnber_anzmassn0
      on apflora.v_popmassnber_anzmassn0.pop_id = apflora.popmassnber.pop_id and apflora.v_popmassnber_anzmassn0.jahr = apflora.popmassnber.jahr
    ON apflora.pop.id = apflora.popmassnber.pop_id)
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;