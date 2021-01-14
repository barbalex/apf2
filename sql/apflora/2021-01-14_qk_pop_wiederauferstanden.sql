-- Beschreibung von K. Marti:
-- Wird bei einer ursprünglich erloschenen Population eine Anpflanzung/Ansaat vorgenommen, 
-- dann ist eine neue Population in der APFloraDB anzulegen. 
-- In der Regel wird zuerst die Massnahme ausgeführt und danach erfolgt die Eingabe in die DB und eine allfällige Statusänderung. 
-- D.h. mit einer Qualitätskontrolle müsste überprüft werden, ob bei einer im Vorjahr ursprünglich erloschenen Population 
-- im aktuellen Jahr eine Statusänderung erfolgt ist (ursprünglich aktuell, angesiedelt aktuell, Ansaatversuch) 
-- und eine Ansiedlungsmassnahme (Anpflanzung oder Ansaat). Das wäre dann eine Fehler.

-- name: popStatusUrspruenglichWiederauferstanden
-- titel: Population: Status war 'ursprünglich, erloschen'. Nach einer Ansiedlung wieder 'ursprünglich aktuell', 'angesiedelt aktuell', 'Ansaatversuch'

-- sql:
DROP VIEW IF EXISTS apflora.v_q_pop_urspruenglich_wiederauferstanden CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_pop_urspruenglich_wiederauferstanden AS
with pop_id_ansiedlung_jahre as (
  select distinct
    tpop.pop_id as id,
    massn.jahr
  from
    apflora.tpop tpop
    inner join apflora.tpopmassn massn
      inner join apflora.tpopmassn_typ_werte massntyp
      on massn.typ = massntyp.code
    on tpop.id = massn.tpop_id
  where
    massntyp.ansiedlung = true
  order by
    tpop.pop_id,
    massn.jahr
)
select
  projekt.id as proj_id,
  tax.artname,
  ap.id as ap_id,
  pop.id,
  pop.nr,
  pop_id_ansiedlung_jahre.jahr
from
  apflora.pop pop
  inner join pop_id_ansiedlung_jahre
    inner join apflora.pop_history pop_history
    on pop_id_ansiedlung_jahre.id = pop_history.id and pop_history.year = pop_id_ansiedlung_jahre.jahr - 1
  on pop.id = pop_id_ansiedlung_jahre.id
  inner join apflora.ap ap
    inner join apflora.projekt projekt
    on projekt.id = ap.proj_id
    inner join apflora.ae_taxonomies tax
    on ap.art_id = tax.id
  on ap.id = pop.ap_id
where
  pop.status = 101
  and pop_history.status in (100, 200, 201);

-- ensure this qk is choosen:
insert into apflora.apqk (ap_id, qk_name)
select distinct
  id as ap_id,
  'popStatusUrspruenglichWiederauferstanden' as qk_name
from apflora.ap ap
inner join apflora.apqk qk
on ap.id = qk.ap_id
on conflict do nothing;

-- this qk schall sort as 51
update apflora.qk
set sort = sort + 1
where sort > 50;

update apflora.qk
set sort = 51
where name = 'popStatusUrspruenglichWiederauferstanden';
