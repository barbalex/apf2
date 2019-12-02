-- DO NOT RUN ON APFLORA_LIVE YET
-- TEST RESULTS MORE BEFORE
-- sent email to topos
with kontrolljahre as (
  select
    tpop1.id,
    apflora.ekfrequenz.ektyp,
    tpop1.ekfrequenz_startjahr, 
    unnest(apflora.ekfrequenz.kontrolljahre) as kontrolljahr
  from
    apflora.tpop tpop1
    inner join apflora.ekfrequenz
    on apflora.ekfrequenz.id = tpop1.ekfrequenz
  where
    tpop1.ekfrequenz is not null
    and tpop1.ekfrequenz_startjahr is not null
    and apflora.ekfrequenz.kontrolljahre is not null
    and (
      select count(*)
      from apflora.ekplan
      where tpop_id = tpop1.id
    ) = 0
  order by
    tpop1.id,
    tpop1.ekfrequenz_startjahr
),
ekplans as (
  select
    id as tpop_id,
    kontrolljahr + ekfrequenz_startjahr as jahr,
    ektyp as typ,
    '2019-12-01' as changed,
    'ag' as changed_by
  from
    kontrolljahre
)
insert into apflora.ekplan(tpop_id,jahr,typ,changed,changed_by)
select
  tpop_id,
  jahr,
  typ::ek_type,
  changed::date,
  changed_by
from ekplans;

-- to show before updating:
with kontrolljahre as (
  select
    tpop1.id,
    apflora.ekfrequenz.ektyp,
    tpop1.ekfrequenz_startjahr, 
    unnest(apflora.ekfrequenz.kontrolljahre) as kontrolljahr
  from
    apflora.tpop tpop1
    inner join apflora.ekfrequenz
    on apflora.ekfrequenz.id = tpop1.ekfrequenz
  where
    tpop1.ekfrequenz is not null
    and tpop1.ekfrequenz_startjahr is not null
    and apflora.ekfrequenz.kontrolljahre is not null
    and (
      select count(*)
      from apflora.ekplan
      where tpop_id = tpop1.id
    ) = 0
  order by
    tpop1.id,
    tpop1.ekfrequenz_startjahr
),
ekplans as (
  select
    id as tpop_id,
    kontrolljahr + ekfrequenz_startjahr as jahr,
    ektyp as typ,
    '2019-12-01' as changed,
    'ag' as changed_by
  from
    kontrolljahre
)
select
  tax.artname,
  pop.nr,
  tpop.nr,
  ekplans.jahr,
  ekplans.typ
from ekplans
inner join apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on ap.id = pop.ap_id
  on pop.id = tpop.pop_id
on tpop.id = ekplans.tpop_id
order by
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  jahr;