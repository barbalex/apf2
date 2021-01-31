select
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  massn.jahr,
  massn_typ.text as typ,
  ekzaehleinheit.zaehleinheit_id,
  zaehl_einheit_werte.text,
  zaehl_einheit_werte.code as zaehleinheit_code,
  case
    when zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true then massn.anz_triebe
    when zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true then massn.anz_pflanzen
  end as anzahl
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
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
  and massn.zieleinheit_einheit is null
  and ekzaehleinheit.not_massn_count_unit is false
  and (
    (zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true and massn.anz_triebe is not null)
    or (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true and massn.anz_pflanzen is not null)
  )
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;

-- find out how often the ekzaehleinheit is missing
select
  tax.artname,
  case
    when ap.bearbeitung between 1 and 3 then true
    else false
  end as ap_art,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  massn.jahr,
  massn_typ.text as typ,
  ekzaehleinheit.zaehleinheit_id,
  zaehl_einheit_werte.text,
  zaehl_einheit_werte.code as zaehleinheit_code,
  case
    when zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true then massn.anz_triebe
    when zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true then massn.anz_pflanzen
  end as anzahl
from apflora.tpopmassn massn
  inner join apflora.tpopmassn_typ_werte massn_typ
  on massn_typ.code = massn.typ
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
  and massn.zieleinheit_einheit is null
  and ekzaehleinheit.not_massn_count_unit is false
  and ap.bearbeitung between 1 and 3
  ---and (
  ---  (zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true and massn.anz_triebe is not null)
  ---  or (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true and massn.anz_pflanzen is not null)
  ---)
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;


with anpfl as (
  select
    massn.id,
    zaehl_einheit_werte.code as zaehleinheit_code,
    case
      when zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true then massn.anz_triebe
      when zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true then massn.anz_pflanzen
    end as anzahl
  from apflora.tpopmassn massn
    inner join apflora.tpopmassn_typ_werte massn_typ
    on massn_typ.code = massn.typ
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
    and massn.zieleinheit_einheit is null
    and ekzaehleinheit.not_massn_count_unit is false
    and (
      (zaehl_einheit_werte.corresponds_to_massn_anz_triebe = true and massn.anz_triebe is not null)
      or (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = true and massn.anz_pflanzen is not null)
    )
)
update apflora.tpopmassn
set zieleinheit_einheit = anpfl.zaehleinheit_code, zieleinheit_anzahl = anpfl.anzahl
from anpfl
where apflora.tpopmassn.id = anpfl.id;