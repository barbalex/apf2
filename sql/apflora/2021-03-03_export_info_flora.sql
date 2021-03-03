DROP VIEW IF EXISTS apflora.v_export_info_flora_ort CASCADE;
CREATE OR REPLACE VIEW apflora.v_export_info_flora_ort AS
with kontrolle_mit_groesster_anzahl as (
  SELECT distinct on (kontr0.id)
    kontr0.id,
    zaehl0.anzahl
  FROM
    apflora.tpopkontr kontr0
    INNER JOIN apflora.tpopkontrzaehl zaehl0
    ON kontr0.id = zaehl0.tpopkontr_id
  order by
    kontr0.id,
    zaehl0.anzahl desc
)
SELECT
  -- include TPopGuid to enable later views to include only tpop included here
  concat('{', upper(apflora.tpop.id::text), '}') as "TPopGuid",
  concat('{', upper(apflora.tpop.id::text), '}') as "idOrt",
  1 AS "fkGenauigkeitLage",
  1 AS "fkGeometryType",
  CASE
    WHEN apflora.tpop.hoehe IS NOT NULL
    THEN apflora.tpop.hoehe
    ELSE 0
  END AS "obergrenzeHoehe",
  4 AS "fkGenauigkeitHoehe",
  apflora.tpop.lv95_x AS "X",
  apflora.tpop.lv95_y AS "Y",
  substring(apflora.tpop.gemeinde from 1 for 25) AS "NOM_COMMUNE",
  substring(apflora.tpop.flurname from 1 for 255) AS "DESC_LOCALITE",
  max(apflora.tpopkontr.lr_umgebung_delarze) AS "ENV",
  CASE
    WHEN apflora.tpop.status IS NOT NULL
    THEN
      concat(
        'Status: ',
        apflora.pop_status_werte.text,
        CASE
          WHEN apflora.tpop.bekannt_seit IS NOT NULL
          THEN
            concat(
              '; Bekannt seit: ',
              apflora.tpop.bekannt_seit
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
        ON apflora.tpop.status = apflora.pop_status_werte.code)
      INNER JOIN
        (((apflora.tpopkontr
        INNER JOIN
          kontrolle_mit_groesster_anzahl
          ON kontrolle_mit_groesster_anzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        LEFT JOIN apflora.evab_typologie
          ON apflora.tpopkontr.lr_delarze = apflora.evab_typologie."TYPO")
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN apflora.ae_taxonomies
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  -- keine Testarten
  apflora.ae_taxonomies.taxid > 150
  AND apflora.ae_taxonomies.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.lv95_x IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND apflora.tpopkontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND apflora.tpopkontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop.bekannt_seit IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop.status IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop.bekannt_seit) > 5
  )
  AND apflora.tpop.flurname IS NOT NULL
GROUP BY
  apflora.pop.id,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.bekannt_seit,
  apflora.tpop.flurname,
  apflora.tpop.status,
  apflora.pop_status_werte.text,
  apflora.tpop.hoehe,
  apflora.tpop.lv95_x,
  apflora.tpop.lv95_y,
  apflora.tpop.gemeinde;

DROP VIEW IF EXISTS apflora.v_export_info_flora_zeit CASCADE;
CREATE OR REPLACE VIEW apflora.v_export_info_flora_zeit AS
with kontrolle_mit_groesster_anzahl as (
  SELECT distinct on (kontr0.id)
    kontr0.id,
    zaehl0.anzahl
  FROM
    apflora.tpopkontr kontr0
    INNER JOIN apflora.tpopkontrzaehl zaehl0
    ON kontr0.id = zaehl0.tpopkontr_id
  order by
    kontr0.id,
    zaehl0.anzahl desc
)
SELECT
  concat('{', upper(apflora.tpop.id::text), '}') as "fkOrt",
  concat('{', upper(apflora.tpopkontr.zeit_id::text), '}') as "idZeitpunkt",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN to_char(apflora.tpopkontr.datum, 'DD.MM.YYYY')
    ELSE
      concat(
        '01.01.',
        apflora.tpopkontr.jahr
      )
  END AS "Datum",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN 'T'::varchar(10)
    ELSE 'J'::varchar(10)
  END AS "fkGenauigkeitDatum",
  CASE
    WHEN apflora.tpopkontr.datum IS NOT NULL
    THEN 'P'::varchar(10)
    ELSE 'X'::varchar(10)
  END AS "fkGenauigkeitDatumZDSF",
  substring(apflora.tpopkontr.moosschicht from 1 for 10) AS "COUV_MOUSSES",
  substring(apflora.tpopkontr.krautschicht from 1 for 10) AS "COUV_HERBACEES",
  substring(apflora.tpopkontr.strauchschicht from 1 for 10) AS "COUV_BUISSONS",
  substring(apflora.tpopkontr.baumschicht from 1 for 10) AS "COUV_ARBRES"
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      ((apflora.tpop
      LEFT JOIN
        apflora.pop_status_werte AS tpop_status_werte
        ON apflora.tpop.status = tpop_status_werte.code)
      INNER JOIN
        ((apflora.tpopkontr
        INNER JOIN
          kontrolle_mit_groesster_anzahl
          ON kontrolle_mit_groesster_anzahl.id = apflora.tpopkontr.id)
        LEFT JOIN
          apflora.adresse
          ON apflora.tpopkontr.bearbeiter = apflora.adresse.id)
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN apflora.ae_taxonomies
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  -- keine Testarten
  apflora.ae_taxonomies.taxid > 150
  AND apflora.ae_taxonomies.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND apflora.tpop.lv95_x IS NOT NULL
  AND apflora.tpopkontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND apflora.tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND apflora.tpopkontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND apflora.tpopkontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
  -- nur wenn Kontrolljahr existiert
  AND apflora.tpopkontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND apflora.tpopkontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND apflora.tpop.bekannt_seit IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    apflora.tpop.status IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (apflora.tpopkontr.jahr - apflora.tpop.bekannt_seit) > 5
  )
  AND apflora.tpop.flurname IS NOT NULL;
