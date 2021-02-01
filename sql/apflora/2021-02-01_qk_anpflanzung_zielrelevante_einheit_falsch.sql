-- v_q_anpflanzung_ohne_zielrelevante_einheit
-- v_q_anpflanzung_zielrelevante_einheit_falsch
select
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  massn.jahr,
  massn_typ.text as typ,
  zaehl_einheit_werte.text as ek_zieleinheit,
  massn_einheit_werte.text as massn_zieleinheit
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
  inner join apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte
  on massn_einheit_werte.code = massn.zieleinheit_einheit
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
        inner join apflora.ekzaehleinheit as ekzaehleinheit
          inner join apflora.tpopkontrzaehl_einheit_werte as zaehl_einheit_werte
          on zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id
        on ekzaehleinheit.ap_id = ap.id and ekzaehleinheit.zielrelevant = true
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on massn.tpop_id = tpop.id
where
  massn.typ = 2
  and massn.zieleinheit_einheit <> zaehl_einheit_werte.code
  and ekzaehleinheit.not_massn_count_unit is false
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;



DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_einheit_falsch CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_einheit_falsch AS
select
  ap.proj_id,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  tpop.id as tpop_id,
  tpop.nr as tpop_nr,
  massn.id,
  massn.jahr,
  zaehl_einheit_werte.text as ek_zieleinheit,
  massn_einheit_werte.text as massn_zieleinheit
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
  inner join apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte
  on massn_einheit_werte.code = massn.zieleinheit_einheit
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
        inner join apflora.ekzaehleinheit as ekzaehleinheit
          inner join apflora.tpopkontrzaehl_einheit_werte as zaehl_einheit_werte
          on zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id
        on ekzaehleinheit.ap_id = ap.id and ekzaehleinheit.zielrelevant = true
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on massn.tpop_id = tpop.id
where
  massn.typ = 2
  and massn.zieleinheit_einheit <> zaehl_einheit_werte.code
  and ekzaehleinheit.not_massn_count_unit is false
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;

-- add qk to apflora.qk
insert into apflora.qk (name, titel)
values ('anpflanzungZielrelevanteEinheitFalsch', 'Anpflanzung: Die zielrelevante Einheit entspricht nicht (mehr) der Einstellung bei den EK-Zähleinheiten');


-- ensure this qk is choosen:
insert into apflora.apqk (ap_id, qk_name)
select distinct
  id as ap_id,
  'anpflanzungZielrelevanteEinheitFalsch' as qk_name
from apflora.ap ap
inner join apflora.apqk qk
on ap.id = qk.ap_id
on conflict do nothing;

-- this qk schall sort as 90
update apflora.qk
set sort = sort + 1
where sort > 89;

update apflora.qk
set sort = 90
where name = 'anpflanzungZielrelevanteEinheitFalsch';