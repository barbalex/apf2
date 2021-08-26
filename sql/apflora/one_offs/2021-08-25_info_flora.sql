-- id_original
alter table apflora.beob
add column id_original text default null;
CREATE INDEX ON apflora.beob USING btree (id_original);
update apflora.beob
set id_original = beob.data->>(beob.id_field);
--
-- id_evab
alter table apflora.beob
add column id_evab text default null;
CREATE INDEX ON apflora.beob USING btree (id_evab);
update apflora.beob
set id_evab = beob.data->>(beob.id_field)
where quelle = 'EvAB 2016';
update apflora.beob
set id_evab = beob.data->>('evab_id')
where quelle = 'Info Flora 2021.05';
--
-- id_evab_lc
alter table apflora.beob
add column id_evab_lc text default null;
CREATE INDEX ON apflora.beob USING btree (id_evab_lc);
update apflora.beob
set id_evab_lc = lower(id_evab)
where id_evab is not null;
--
-- find duplicate evab_id's
select id_evab_lc
from apflora.beob
group by id_evab_lc
having count(*) > 1;
-- 4077
-- find duplicate beob
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  );
-- 8153
-- find duplicates in quelle 'Info Flora 2021.05'
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05';
-- 4077
-- have they been worked on?
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (
    tpop_id is not null
    or nicht_zuordnen = true
    or bemerkungen is not null
    or art_id_original <> art_id
    or infoflora_informiert_datum is not null
  );
-- 561
-- beob duplicates that have not been worked on
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and id not in (
    select id
    from apflora.beob
    where id_evab_lc in (
        select id_evab_lc
        from apflora.beob
        group by id_evab_lc
        having count(*) > 1
      )
      and quelle = 'Info Flora 2021.05'
      and (
        tpop_id is not null
        or nicht_zuordnen = true
        or bemerkungen is not null
        or art_id_original <> art_id
        or infoflora_informiert_datum is not null
      )
  );
-- 3516
-- delete duplicates that have not been worked on
delete from apflora.beob
where id in (
    select id
    from apflora.beob
    where id_evab_lc in (
        select id_evab_lc
        from apflora.beob
        group by id_evab_lc
        having count(*) > 1
      )
      and quelle = 'Info Flora 2021.05'
      and id not in (
        select id
        from apflora.beob
        where id_evab_lc in (
            select id_evab_lc
            from apflora.beob
            group by id_evab_lc
            having count(*) > 1
          )
          and quelle = 'Info Flora 2021.05'
          and (
            tpop_id is not null
            or nicht_zuordnen = true
            or bemerkungen is not null
            or art_id_original <> art_id
            or infoflora_informiert_datum is not null
          )
      )
  );
-- 3516 deleted
-- tpop_id changed
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (tpop_id is not null);
-- 460
-- nicht_zuordnen changed
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (nicht_zuordnen = true);
-- 20
-- bemerkungen changed
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (bemerkungen is not null);
-- 6
-- art changed
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (art_id_original <> art_id);
-- 0
-- infoflora_informiert_datum changed
select *
from apflora.beob
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (infoflora_informiert_datum is not null);
-- 4
-- 561 duplicates that have been worked on with extra information
select tax.artname,
  pop.nr as "zugeordnet_pop_nr",
  pop.name as "zugeordnet_pop_name",
  tpop.nr as "zugeordnet_tpop_nr",
  tpop.flurname as "zugeordnet_tpop_flurname",
  beob.*
from apflora.beob beob
  left join apflora.tpop tpop on tpop.id = beob.tpop_id
  left join apflora.pop pop on pop.id = tpop.pop_id
  left join apflora.ap ap on ap.id = pop.ap_id
  left join apflora.ae_taxonomies tax on beob.art_id = tax.id
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
  and quelle = 'Info Flora 2021.05'
  and (
    beob.tpop_id is not null
    or beob.nicht_zuordnen = true
    or beob.bemerkungen is not null
    or beob.art_id_original <> beob.art_id
    or beob.infoflora_informiert_datum is not null
  );
-- 561 duplicates that have been worked on with extra information
-- including on other beob
select tax.artname,
  pop.nr as "zugeordnet_pop_nr",
  pop.name as "zugeordnet_pop_name",
  tpop.nr as "zugeordnet_tpop_nr",
  tpop.flurname as "zugeordnet_tpop_flurname",
  beob.*
from apflora.beob beob
  left join apflora.tpop tpop on tpop.id = beob.tpop_id
  left join apflora.pop pop on pop.id = tpop.pop_id
  left join apflora.ap ap on ap.id = pop.ap_id
  left join apflora.ae_taxonomies tax on beob.art_id = tax.id
where id_evab_lc in (
    select id_evab_lc
    from apflora.beob
    group by id_evab_lc
    having count(*) > 1
  )
order by tax.artname,
  beob.id_evab_lc;
-- art missing:
select *
from apflora.beob
where art_id is null
  and quelle = 'Info Flora 2021.05';
-- 279
-- does not exist in sisf2, some neither in Checklist 2017 (Chara)
-- obs_id
alter table apflora.beob
add column obs_id bigint default null;
CREATE INDEX ON apflora.beob USING btree (obs_id);
-- update quelle 'Info Flora 2021.05'
update apflora.beob
set obs_id = (beob.data->>('obs_id'))::bigint
where quelle = 'Info Flora 2021.05';
-- update quelle 'Info Flora 2017'
update apflora.beob
set obs_id = (beob.data->>('NO_NOTE'))::bigint
where quelle = 'Info Flora 2017';
-- check for duplicate obs_id's:
select obs_id
from apflora.beob
group by obs_id
having count(*) > 1;
--
-- EvAB 2016 (233'156 rows)
select beob.id,
  beob.id_evab_lc,
  iflo.evab_id
from apflora.beob beob
  left join apflora.infoflora20210817 iflo on iflo.evab_id::text = beob.id_evab_lc
where quelle = 'EvAB 2016';
-- 233'157
select beob.id,
  beob.id_evab_lc,
  iflo.evab_id
from apflora.beob beob
  left join apflora.infoflora20210817 iflo on iflo.evab_id::text = beob.id_evab_lc
where quelle = 'EvAB 2016'
  and iflo.evab_id is null;
-- 229'080!
-- yeah, infoflora20210817 only selected ap species...
select beob.id,
  beob.id_evab_lc,
  iflo.evab_id
from apflora.beob beob
  left join apflora.infoflora20210817 iflo on iflo.evab_id::text = beob.id_evab_lc
where quelle = 'EvAB 2016'
  and iflo.evab_id is not null;
-- 4077