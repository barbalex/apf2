-- 1. add new field:
alter table apflora.beob add column quelle text default null;
create index on apflora.beob using btree (quelle);
comment on column apflora.beob.quelle is 'Woher stammt die Beobachtung? Bitte prägnant und kurz formulieren, ähnlich einem Literaturzitat, z.B. "Info Flora 2017"';

-- 2. correct all instances of beob_quelle_werte
drop function if exists apflora.beob_label(beob apflora.beob);
create function apflora.beob_label(beob apflora.beob) returns text as $$
  select to_char(beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(beob.autor, '(kein Autor)') || beob.quelle || ')'
$$ language sql stable;

DROP VIEW IF EXISTS apflora.v_beob;
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

drop view apflora.v_beob_art_changed;
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

drop VIEW apflora.v_apbeob;
CREATE OR REPLACE VIEW apflora.v_apbeob AS
select
  beob.id,
  beob.quelle,
  beob.id_field,
  beob.art_id,
  beob.datum,
  beob.autor,
  beob.geom_point,
  beob.data,
  beob.tpop_id,
  beob.nicht_zuordnen,
  beob.infoflora_informiert_datum,
  beob.bemerkungen,
  beob.changed,
  beob.changed_by,
  beob.wgs84_lat,
  beob.wgs84_long,
  apflora.apart.ap_id,
  to_char(beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(beob.autor, '(kein Autor)') || ' (' || beob.quelle || ')' as label
from
  apflora.beob beob
  inner join apflora.apart
  on apflora.apart.art_id = beob.art_id
order by
  beob.datum desc,
  beob.autor asc,
  beob.quelle asc;

drop VIEW apflora.v_beob_art_changed;
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

-- 3. correct all instances of beobQuelleWerte: done
-- 4. correct all instances of quelle_id, quelleId: done
-- 5. fill quelle field with data from beob_quelle_werte.name
update apflora.beob beob
set quelle = 'EvAB 2016'
from apflora.beob_quelle_werte werte
where
  werte.id = beob.quelle_id
  and werte.name = 'evab';
  
update apflora.beob beob
set quelle = 'Info Flora 2017'
from apflora.beob_quelle_werte werte
where
  werte.id = beob.quelle_id
  and werte.name = 'infospezies';

update apflora.beob beob
set quelle = 'FloZ 2017'
from apflora.beob_quelle_werte werte
where
  werte.id = beob.quelle_id
  and werte.name = 'FloZ';

-- replace app
-- zuletzt:
alter table apflora.beob drop column quelle_id;
drop table apflora.beob_quelle_werte;
-- clean in createTables.sql