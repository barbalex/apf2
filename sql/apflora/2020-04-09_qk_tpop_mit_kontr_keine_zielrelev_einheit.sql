-- AP mit Kontrollen im Jahr, aber keine zielrelevante Einheit erfasst
DROP VIEW IF EXISTS apflora.v_q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit AS
with ap_mit_zielrelevanter_zaehleinheit as (
  select distinct apflora.ap.id
  from
    apflora.ap
    inner join apflora.ekzaehleinheit
    on apflora.ekzaehleinheit.ap_id = apflora.ap.id
  where
    apflora.ekzaehleinheit.zielrelevant = true
),
ap_ohne_zielrelevante_zaehleinheit as (
  select distinct apflora.ap.id
  from
    apflora.ap
    left join ap_mit_zielrelevanter_zaehleinheit
    on ap_mit_zielrelevanter_zaehleinheit.id = apflora.ap.id
  where ap_mit_zielrelevanter_zaehleinheit.id is null
),
tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
    inner join apflora.pop
      inner join ap_ohne_zielrelevante_zaehleinheit
      on ap_ohne_zielrelevante_zaehleinheit.id = apflora.pop.ap_id
    on apflora.pop.id = apflora.tpop.pop_id
  where
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
)
SELECT distinct
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id
FROM
  apflora.projekt
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit
        on tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_zaehleinheit.id = apflora.tpop.id
      ON apflora.tpop.pop_id = apflora.pop.id
    ON apflora.pop.ap_id = apflora.ap.id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.projekt.id,
  apflora.ap.id;


-- make room to sort new qk in to
update apflora.qk
set sort = sort + 1
where sort > 3;

-- insert new qk
insert into apflora.qk (name, titel, sort)
values ('apMitAktKontrOhneZielrelevanteEinheit', 'AP mit Kontrollen im aktuellen Jahr. Aber eine Ziel-relevante Einheit fehlt', 4);


-- add new apqk's
with apqks as (
  select distinct ap_id from apflora.apqk
)
insert into apflora.apqk (ap_id, qk_name)
select
  ap_id,
  'apMitAktKontrOhneZielrelevanteEinheit'
from apqks;

-- TPop mit Kontrollen im aktuellen Jahr, aber die zielrelevante Einheit wurde nie erfasst
DROP VIEW IF EXISTS apflora.v_q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit AS
with zielrelevante_zaehleinheit_pro_ap as (
  select
    apflora.ap.id,
    apflora.tpopkontrzaehl_einheit_werte.code as zaehleinheit_code
  from
    apflora.ap
    left join apflora.ekzaehleinheit
      inner join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl_einheit_werte.id = apflora.ekzaehleinheit.zaehleinheit_id
    on apflora.ekzaehleinheit.ap_id = apflora.ap.id and apflora.ekzaehleinheit.zielrelevant = true
),
tpop_mit_aktuellen_kontrollen as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopkontr
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
  where
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
),
tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopkontr
      inner join apflora.tpopkontrzaehl
      on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    on apflora.tpop.id = apflora.tpopkontr.tpop_id
    inner join apflora.pop
      inner join zielrelevante_zaehleinheit_pro_ap
      on zielrelevante_zaehleinheit_pro_ap.id = apflora.pop.ap_id
    on apflora.pop.id = apflora.tpop.pop_id
  where
    apflora.tpopkontr.jahr = date_part('year', CURRENT_DATE)
    and apflora.tpopkontrzaehl.einheit = zielrelevante_zaehleinheit_pro_ap.zaehleinheit_code
),
tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit as (
  select
    tpop_mit_aktuellen_kontrollen.id 
  from 
    tpop_mit_aktuellen_kontrollen
    left join tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit
    on tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit.id = tpop_mit_aktuellen_kontrollen.id
  where
    tpop_mit_aktuellen_kontrollen_zielrelevanter_einheit is null
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit
        on tpop_ohne_aktuelle_kontrollen_zielrelevanter_einheit.id = apflora.tpop.id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;


-- make room to sort new qk in to
update apflora.qk
set sort = sort + 1
where sort > 79;

-- insert new qk
insert into apflora.qk (name, titel, sort)
values ('tpopMitAktuellenKontrollenOhneZielrelevanteEinheit', 'Teilpopulation mit Kontrollen im aktuellen Jahr. Aber die zielrelevante Einheit wurde nie erfasst', 80);


-- add new apqk's
with apqks as (
  select distinct ap_id from apflora.apqk
)
insert into apflora.apqk (ap_id, qk_name)
select
  ap_id,
  'tpopMitAktuellenKontrollenOhneZielrelevanteEinheit'
from apqks;