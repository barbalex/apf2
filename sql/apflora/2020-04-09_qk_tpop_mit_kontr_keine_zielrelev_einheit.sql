-- TPop mit Kontrollen im Jahr, aber keine zielrelevante Einheit erfasst
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