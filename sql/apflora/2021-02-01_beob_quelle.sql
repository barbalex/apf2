-- 1. add new field:
alter table apflora.beob add column quelle text default null;
create index on apflora.beob using btree (quelle);
comment on column apflora.beob.quelle is 'Woher stammt die Beobachtung? Bitte prägnant und kurz formulieren, ähnlich einem Literaturzitat, z.B. "Info Flora 2017"';

-- 2. correct all instances of beob_quelle_werte
drop function if exists apflora.beob_label(beob apflora.beob);
create function apflora.beob_label(beob apflora.beob) returns text as $$
  select to_char(beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(beob.autor, '(kein Autor)') || beob.quelle || ')'
$$ language sql stable;

CREATE OR REPLACE VIEW apflora.v_beob AS
SELECT
  apflora.beob.id,
  apflora.beob.quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "OriginalId",
  apflora.beob.art_id,
  apflora.beob.art_id_original,
  apflora.ae_taxonomies.artname AS "Artname",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  pop_status_werte.text AS tpop_status,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  apflora.beob.lv95_x as x,
  apflora.beob.lv95_y as y,
  CASE
    WHEN
      apflora.beob.lv95_x > 0
      AND apflora.tpop.lv95_x > 0
    THEN
      round(ST_Distance(ST_Transform(apflora.beob.geom_point, 2056), ST_Transform(apflora.tpop.geom_point, 2056)))
    ELSE
      NULL
  END AS distanz_zur_teilpopulation,
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by
FROM
  ((apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id)
  INNER JOIN
    apflora.ae_taxonomies
    INNER JOIN
      apflora.ap
      ON apflora.ap.art_id = apflora.ae_taxonomies.id
    ON apflora.beob.art_id = apflora.ae_taxonomies.id)
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop_status_werte AS pop_status_werte
      ON apflora.tpop.status = pop_status_werte.code
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  apflora.ae_taxonomies.taxid > 150
ORDER BY
  apflora.ae_taxonomies.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;


CREATE OR REPLACE VIEW apflora.v_beob_art_changed AS
SELECT
  apflora.beob.id,
  apflora.beob.quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "original_id",
  apflora.beob.art_id_original,
  ae_artidoriginal.artname AS "artname_original",
  ae_artidoriginal.taxid AS "taxonomie_id_original",
  apflora.beob.art_id,
  ae_artid.artname AS "artname",
  ae_artid.taxid AS "taxonomie_id",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  pop_status_werte.text AS tpop_status,
  apflora.tpop.gemeinde AS tpop_gemeinde,
  apflora.tpop.flurname AS tpop_flurname,
  apflora.beob.lv95_x as x,
  apflora.beob.lv95_y as y,
  CASE
    WHEN
      apflora.beob.lv95_x > 0
      AND apflora.tpop.lv95_x > 0
    THEN
      round(ST_Distance(ST_Transform(apflora.beob.geom_point, 2056), ST_Transform(apflora.tpop.geom_point, 2056)))
    ELSE
      NULL
  END AS distanz_zur_teilpopulation,
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by
FROM
  apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artid
    INNER JOIN
      apflora.ap as artidsap
      ON artidsap.art_id = ae_artid.id
    ON apflora.beob.art_id = ae_artid.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artidoriginal
    INNER JOIN
      apflora.ap as artidoriginalsap
      ON artidoriginalsap.art_id = ae_artidoriginal.id
    ON apflora.beob.art_id_original = ae_artidoriginal.id
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop_status_werte AS pop_status_werte
      ON apflora.tpop.status = pop_status_werte.code
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  ae_artid.taxid > 150
  and apflora.beob.art_id <> apflora.beob.art_id_original
ORDER BY
  ae_artid.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;


CREATE OR REPLACE VIEW apflora.v_apbeob AS
select
  apflora.beob.*,
  apflora.beob.wgs84_lat,
  apflora.beob.wgs84_long,
  apflora.apart.ap_id,
  apflora.beob.quelle,
  to_char(apflora.beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(apflora.beob.autor, '(kein Autor)') || ' (' || apflora.beob.quelle || ')' as label
from
  apflora.beob
  inner join apflora.apart
  on apflora.apart.art_id = apflora.beob.art_id
order by
  apflora.beob.datum desc,
  apflora.beob.autor asc,
  apflora.beob.quelle asc;


CREATE OR REPLACE VIEW apflora.v_beob_art_changed AS
SELECT
  apflora.beob.id,
  apflora.beob.quelle,
  beob.id_field,
  beob.data->>(SELECT id_field FROM apflora.beob WHERE id = beob2.id) AS "original_id",
  apflora.beob.art_id_original,
  ae_artidoriginal.artname AS "artname_original",
  ae_artidoriginal.taxid AS "taxonomie_id_original",
  apflora.beob.art_id,
  ae_artid.artname AS "artname",
  ae_artid.taxid AS "taxonomie_id",
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id AS tpop_id,
  apflora.tpop.nr AS tpop_nr,
  apflora.beob.x,
  apflora.beob.y,
  CASE
    WHEN
      apflora.beob.x > 0
      AND apflora.tpop.x > 0
      AND apflora.beob.y > 0
      AND apflora.tpop.y > 0
    THEN
      round(
        sqrt(
          power((apflora.beob.x - apflora.tpop.x), 2) +
          power((apflora.beob.y - apflora.tpop.y), 2)
        )
      )
    ELSE
      NULL
  END AS distanz_zur_teilpopulation,
  apflora.beob.datum,
  apflora.beob.autor,
  apflora.beob.nicht_zuordnen,
  apflora.beob.bemerkungen,
  apflora.beob.changed,
  apflora.beob.changed_by
FROM
  apflora.beob
  INNER JOIN
    apflora.beob AS beob2
    ON beob2.id = beob.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artid
    INNER JOIN
      apflora.ap as artidsap
      ON artidsap.art_id = ae_artid.id
    ON apflora.beob.art_id = ae_artid.id
  INNER JOIN
    apflora.ae_taxonomies AS ae_artidoriginal
    INNER JOIN
      apflora.ap as artidoriginalsap
      ON artidoriginalsap.art_id = ae_artidoriginal.id
    ON apflora.beob.art_id_original = ae_artidoriginal.id
  LEFT JOIN
    apflora.tpop
    ON apflora.tpop.id = apflora.beob.tpop_id
    LEFT JOIN
      apflora.pop
      ON apflora.pop.id = apflora.tpop.pop_id
WHERE
  ae_artid.taxid > 150
  and apflora.beob.art_id <> apflora.beob.art_id_original
ORDER BY
  ae_artid.artname ASC,
  apflora.pop.nr ASC,
  apflora.tpop.nr ASC,
  apflora.beob.datum DESC;

-- 3. correct all instances of beobQuelleWerte
-- 4. correct all instances of quelle_id, quelleId




-- zuletzt:
alter table apflora.beob drop column quelle_id;
drop table apflora.beob_quelle_werte;
-- clean in createTables.sql