--anpflanzung_ohne_zielrelevante_einheit
select
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  massn.jahr,
  massn_typ.text as typ,
  massn.zieleinheit_einheit,
  massn.zieleinheit_anzahl
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on massn.tpop_id = tpop.id
where
  massn.typ = 2
  and massn.zieleinheit_einheit is null
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;

DROP VIEW IF EXISTS apflora.v_q_anpflanzung_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_ohne_zielrelevante_einheit AS
select
  ap.proj_id,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  tpop.id as tpop_id,
  tpop.nr as tpop_nr,
  massn.id,
  massn.jahr
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on massn.tpop_id = tpop.id
where
  massn.typ = 2
  and massn.zieleinheit_einheit is null
order by
  pop.nr,
  tpop.nr,
  massn.jahr;

-- add qk to apflora.qk
insert into apflora.qk (name, titel)
values ('anpflanzungOhneZielrelevanteEinheit', 'Anpflanzung: Es wurde kein Wert im Feld der zielrelevanten Einheit erfasst');


-- ensure this qk is choosen:
insert into apflora.apqk (ap_id, qk_name)
select distinct
  id as ap_id,
  'anpflanzungOhneZielrelevanteEinheit' as qk_name
from apflora.ap ap
inner join apflora.apqk qk
on ap.id = qk.ap_id
on conflict do nothing;

-- this qk schall sort as 89
update apflora.qk
set sort = sort + 1
where sort > 88;

update apflora.qk
set sort = 89
where name = 'anpflanzungOhneZielrelevanteEinheit';