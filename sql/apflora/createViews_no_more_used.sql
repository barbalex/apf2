

DROP VIEW IF EXISTS apflora.v_idealbiotop CASCADE;
CREATE OR REPLACE VIEW apflora.v_idealbiotop AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.ap.changed AS ap_changed,
  apflora.ap.changed_by AS ap_changed_by,
  apflora.idealbiotop.erstelldatum,
  apflora.idealbiotop.hoehenlage,
  apflora.idealbiotop.region,
  apflora.idealbiotop.exposition,
  apflora.idealbiotop.besonnung,
  apflora.idealbiotop.hangneigung,
  apflora.idealbiotop.boden_typ,
  apflora.idealbiotop.boden_kalkgehalt,
  apflora.idealbiotop.boden_durchlaessigkeit,
  apflora.idealbiotop.boden_humus,
  apflora.idealbiotop.boden_naehrstoffgehalt,
  apflora.idealbiotop.wasserhaushalt,
  apflora.idealbiotop.konkurrenz,
  apflora.idealbiotop.moosschicht,
  apflora.idealbiotop.krautschicht,
  apflora.idealbiotop.strauchschicht,
  apflora.idealbiotop.baumschicht,
  apflora.idealbiotop.bemerkungen,
  apflora.idealbiotop.changed,
  apflora.idealbiotop.changed_by
FROM
  apflora.idealbiotop
  LEFT JOIN
    ((((apflora.ae_taxonomies
    RIGHT JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code)
    LEFT JOIN
      apflora.adresse
      ON apflora.ap.bearbeiter = apflora.adresse.id)
    ON apflora.idealbiotop.ap_id = apflora.ap.id
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.idealbiotop.erstelldatum;

DROP VIEW IF EXISTS apflora.v_popber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber AS
SELECT
  apflora.ap.id as ap_id,
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
  apflora.popber.id,
  apflora.popber.jahr,
  tpop_entwicklung_werte.text AS entwicklung,
  apflora.popber.bemerkungen,
  apflora.popber.changed,
  apflora.popber.changed_by
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
    apflora.popber
    ON apflora.pop.id = apflora.popber.pop_id)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber.entwicklung = tpop_entwicklung_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.popber.jahr,
  tpop_entwicklung_werte.text;

DROP VIEW IF EXISTS apflora.v_popmassnber CASCADE;
CREATE OR REPLACE VIEW apflora.v_popmassnber AS
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
  apflora.popmassnber.id,
  apflora.popmassnber.jahr,
  tpopmassn_erfbeurt_werte.text AS beurteilung,
  apflora.popmassnber.bemerkungen,
  apflora.popmassnber.changed,
  apflora.popmassnber.changed_by
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
    ON apflora.pop.id = apflora.popmassnber.pop_id)
  LEFT JOIN
    apflora.tpopmassn_erfbeurt_werte
    ON apflora.popmassnber.beurteilung = tpopmassn_erfbeurt_werte.code
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_tpop CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop AS
SELECT
  apflora.ap.id AS ap_id,
  apflora.ae_taxonomies.familie,
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.ap.start_jahr AS ap_start_jahr,
  apflora.ap_umsetzung_werte.text AS ap_umsetzung,
  apflora.adresse.name AS ap_bearbeiter,
  apflora.pop.id as pop_id,
  apflora.pop.nr AS pop_nr,
  apflora.pop.name AS pop_name,
  pop_status_werte.text AS pop_status,
  apflora.pop.bekannt_seit AS pop_bekannt_seit,
  apflora.pop.status_unklar AS pop_status_unklar,
  apflora.pop.status_unklar_begruendung AS pop_status_unklar_begruendung,
  apflora.pop.lv95_x AS pop_x,
  apflora.pop.lv95_y AS pop_y,
  apflora.tpop.id,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  pop_status_werte_2.text AS status_decodiert,
  apflora.tpop.bekannt_seit,
  apflora.tpop.status_unklar,
  apflora.tpop.status_unklar_grund,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y,
  apflora.tpop.radius,
  apflora.tpop.hoehe,
  apflora.tpop.exposition,
  apflora.tpop.klima,
  apflora.tpop.neigung,
  apflora.tpop.beschreibung,
  apflora.tpop.kataster_nr,
  apflora.tpop.apber_relevant,
  apflora.tpop.apber_relevant_grund,
  apflora.tpop.eigentuemer,
  apflora.tpop.kontakt,
  apflora.tpop.nutzungszone,
  apflora.tpop.bewirtschafter,
  apflora.tpop.bewirtschaftung,
  apflora.tpop.ekfrequenz,
  apflora.tpop.ekfrequenz_abweichend,
  apflora.tpop.changed,
  apflora.tpop.changed_by
FROM
  apflora.ae_taxonomies
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop.status  = pop_status_werte.code
      LEFT JOIN
        apflora.pop_status_werte AS pop_status_werte_2
        ON apflora.tpop.status = pop_status_werte_2.code
    ON apflora.ap.id = apflora.pop.ap_id
    LEFT JOIN
      apflora.ap_bearbstand_werte
      ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
    LEFT JOIN
      apflora.ap_umsetzung_werte
      ON apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
    LEFT JOIN
      apflora.adresse
      ON apflora.ap.bearbeiter = apflora.adresse.id
  ON apflora.ae_taxonomies.id = apflora.ap.art_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.tpop.nr;

drop view if exists apflora.v_tax_list cascade;
drop view if exists apflora.v_ae_tax_list cascade;
create or replace view apflora.v_ae_tax_list as
select distinct
  taxonomie_id,
  taxonomie_name
from apflora.ae_taxonomies
order by taxonomie_name;

DROP VIEW IF EXISTS apflora.v_tpop_for_ap CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_for_ap AS
SELECT
  apflora.tpop.*,
  -- when renaming ap_id need to rename also in fetchTpopForAp.js
  apflora.ap.id AS ap_id
FROM
  apflora.ap
  INNER JOIN
    apflora.pop
    ON apflora.ap.id = apflora.pop.ap_id
  INNER JOIN
    apflora.tpop
    ON apflora.pop.id = apflora.tpop.pop_id;

DROP VIEW IF EXISTS apflora.v_ap_apberrelevant CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_apberrelevant AS
SELECT
  apflora.ap.id
FROM
  apflora.ap
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.apber_relevant = true
  AND apflora.pop.status  <> 300
GROUP BY
  apflora.ap.id;
  
DROP VIEW IF EXISTS apflora.v_tpop_statuswidersprichtbericht CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_statuswidersprichtbericht AS
with letzter_tpopber as (
  SELECT distinct on (tpop_id)
    tpop_id,
    jahr
  FROM
    apflora.tpopber
  order by
    tpop_id,
    jahr desc
)
SELECT
  apflora.ae_taxonomies.artname AS "Art",
  apflora.ap_bearbstand_werte.text AS "Bearbeitungsstand AP",
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.status,
  apflora.tpopber.entwicklung AS "TPopBerEntwicklung",
  apflora.tpopber.jahr AS tpopber_jahr
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        (apflora.tpopber
        INNER JOIN
          letzter_tpopber
          ON
            (apflora.tpopber.tpop_id = letzter_tpopber.tpop_id)
            AND (apflora.tpopber.jahr = letzter_tpopber.jahr))
        ON apflora.tpop.id = apflora.tpopber.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code
WHERE
  (
    apflora.ap.bearbeitung < 4
    AND (
      apflora.tpop.status = 101
      OR apflora.tpop.status = 202
    )
    AND apflora.tpopber.entwicklung <> 8
  )
  OR (
    apflora.ap.bearbeitung < 4
    AND apflora.tpop.status NOT IN (101, 202)
    AND apflora.tpopber.entwicklung = 8
  )
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_pop_massnseitbeginnap CASCADE;
CREATE OR REPLACE VIEW apflora.v_pop_massnseitbeginnap AS
SELECT
  apflora.tpopmassn.tpop_id
FROM
  apflora.ap
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    INNER JOIN
      apflora.tpopmassn
      ON apflora.tpop.id = apflora.tpopmassn.tpop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpopmassn.jahr >= apflora.ap.start_jahr
GROUP BY
  apflora.tpopmassn.tpop_id;

DROP VIEW IF EXISTS apflora.v_tpop_mitapaberohnestatus CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_mitapaberohnestatus AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  pop_status_werte.text AS pop_status,
  apflora.tpop.nr,
  apflora.tpop.flurname,
  apflora.tpop.status AS status
FROM
  (apflora.ap_bearbstand_werte
  INNER JOIN
    (apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ae_taxonomies.id = apflora.ap.art_id)
    ON apflora.ap_bearbstand_werte.code = apflora.ap.bearbeitung)
  INNER JOIN
    ((apflora.pop
    INNER JOIN
      apflora.pop_status_werte
      ON apflora.pop.status  = pop_status_werte.code)
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.status IS NULL
  AND apflora.ap.bearbeitung = 3
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr;

DROP VIEW IF EXISTS apflora.v_tpop_ohnekoord CASCADE;
CREATE OR REPLACE VIEW apflora.v_tpop_ohnekoord AS
SELECT
  apflora.ae_taxonomies.artname,
  apflora.ap_bearbstand_werte.text AS ap_bearbeitung,
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname,
  apflora.tpop.lv95_x as x,
  apflora.tpop.lv95_y as y
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    apflora.ap
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  INNER JOIN
    apflora.ap_bearbstand_werte
    ON apflora.ap.bearbeitung = apflora.ap_bearbstand_werte.code)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      apflora.tpop
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.tpop.lv95_x IS NULL
  AND apflora.ap.bearbeitung BETWEEN 1 AND 3
ORDER BY
  apflora.ae_taxonomies.artname,
  apflora.pop.nr,
  apflora.pop.name,
  apflora.tpop.nr,
  apflora.tpop.gemeinde,
  apflora.tpop.flurname;

DROP VIEW IF EXISTS apflora.v_ap_anzkontrinjahr CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_anzkontrinjahr AS
SELECT
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.tpopkontr.id as tpopkontr_id,
  apflora.tpopkontr.jahr as tpopkontr_jahr
FROM
  (apflora.ap
  INNER JOIN
    apflora.ae_taxonomies
    ON apflora.ap.art_id = apflora.ae_taxonomies.id)
  INNER JOIN
    (apflora.pop
    INNER JOIN
      (apflora.tpop
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpop.id = apflora.tpopkontr.tpop_id)
      ON apflora.pop.id = apflora.tpop.pop_id)
    ON apflora.ap.id = apflora.pop.ap_id
WHERE
  apflora.ap.bearbeitung BETWEEN 1 AND 3
GROUP BY
  apflora.ap.id,
  apflora.ae_taxonomies.artname,
  apflora.tpopkontr.id,
  apflora.tpopkontr.jahr;

DROP VIEW IF EXISTS apflora.v_popber_angezapbestjahr0 CASCADE;
CREATE OR REPLACE VIEW apflora.v_popber_angezapbestjahr0 AS
SELECT
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.popber.id,
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.nr as pop_nr,
  apflora.pop.name as pop_name,
  pop_status_werte.text AS status ,
  apflora.popber.jahr AS "PopBerJahr",
  tpop_entwicklung_werte.text AS "PopBerEntwicklung",
  apflora.popber.bemerkungen AS "PopBerTxt"
FROM
  ((apflora.ae_taxonomies
  INNER JOIN
    ((apflora.ap
    INNER JOIN
      apflora.pop
      ON apflora.ap.id = apflora.pop.ap_id)
    INNER JOIN
      apflora.popber
      ON apflora.pop.id = apflora.popber.pop_id)
    ON apflora.ae_taxonomies.id = apflora.ap.art_id)
  LEFT JOIN
    apflora.pop_status_werte
    ON apflora.pop.status  = pop_status_werte.code)
  LEFT JOIN
    apflora.tpop_entwicklung_werte
    ON apflora.popber.entwicklung = tpop_entwicklung_werte.code;