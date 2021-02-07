with data as (
  select
    tax.artname,
    pop.nr as pop_nr,
    tpop.nr as tpop_nr,
    massn.jahr,
    massn_typ.text as typ,
    massn.zieleinheit_anzahl as zieleinheit_anzahl,
    ekzaehleinheit.zaehleinheit_id,
    zaehl_einheit_werte.text as ek_zieleinheit,
    massn_einheit_werte.text as massn_zieleinheit,
    case
      when zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true then massn.anz_triebe
      when zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true then massn.anz_pflanzen
    end as anzahl
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
    and massn.zieleinheit_einheit is not null
    and ekzaehleinheit.not_massn_count_unit is false
    and zaehl_einheit_werte.text = massn_einheit_werte.text
    and (
      (zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true and massn.anz_triebe is not null)
      or (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true and massn.anz_pflanzen is not null)
    )
)
select
  *
from data
where
  zieleinheit_anzahl <> anzahl
  or (zieleinheit_anzahl is null and anzahl is not null)
  or (zieleinheit_anzahl is not null and anzahl is null)
order by
  artname,
  pop_nr,
  tpop_nr,
  jahr;

--v_q_anpflanzung_zielrelevante_anzahl_falsch
DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch AS
with data as (
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
    massn.zieleinheit_anzahl as zieleinheit_anzahl,
    case
      when zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true then massn.anz_triebe
      when zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true then massn.anz_pflanzen
    end as anzahl
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
    and massn.zieleinheit_einheit is not null
    and ekzaehleinheit.not_massn_count_unit is false
    and zaehl_einheit_werte.text = massn_einheit_werte.text
    and (
      (zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true and massn.anz_triebe is not null)
      or (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true and massn.anz_pflanzen is not null)
    )
)
select
  *
from data
where
  zieleinheit_anzahl <> anzahl
  or (zieleinheit_anzahl is null and anzahl is not null)
  or (zieleinheit_anzahl is not null and anzahl is null)
order by
  pop_nr,
  tpop_nr,
  jahr;

-- add qk to apflora.qk
insert into apflora.qk (name, titel)
values ('anpflanzungZielrelevanteAnzahlFalsch', 'Anpflanzung: Die zielrelevante Anzahl entspricht nicht der Anzahl der entsprechenden Massnahmen-Einheit');


-- ensure this qk is choosen:
insert into apflora.apqk (ap_id, qk_name)
select distinct
  id as ap_id,
  'anpflanzungZielrelevanteAnzahlFalsch' as qk_name
from apflora.ap ap
inner join apflora.apqk qk
on ap.id = qk.ap_id
on conflict do nothing;

-- this qk schall sort as 91
update apflora.qk
set sort = sort + 1
where sort > 90;

update apflora.qk
set sort = 91
where name = 'anpflanzungZielrelevanteAnzahlFalsch';