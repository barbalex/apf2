


DROP VIEW IF EXISTS apflora.v_ap_ausw_pop_zielrelev_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw_pop_zielrelev_einheit AS

with
massnjahre as (
  select distinct on (tpop0.id, massn0.jahr)
    tpop0.id as tpop_id,
    massn0.jahr,
    massn0.id,
    ze0.text as zaehleinheit,
    massn0.zieleinheit_anzahl as anzahl
  from 
    apflora.tpopmassn massn0
      inner join apflora.tpopmassn_typ_werte tw
      on tw.code = massn0.typ and tw.anpflanzung = true
    inner join apflora.tpop_history tpop0
      inner join apflora.pop_history pop0
        inner join apflora.ap_history ap0
          inner join apflora.ekzaehleinheit ekze0
            inner join apflora.tpopkontrzaehl_einheit_werte ze0
            on ze0.id = ekze0.zaehleinheit_id
          on ekze0.ap_id = ap0.id and ekze0.zielrelevant = true
        on ap0.id = pop0.ap_id
      on pop0.id = tpop0.pop_id
    on tpop0.id = massn0.tpop_id
  where
    massn0.jahr is not null
    and ap0.year = massn0.jahr
    and pop0.year = massn0.jahr
    and tpop0.year = massn0.jahr
    and tpop0.status in (200, 201)
    and massn0.zieleinheit_einheit = ze0.code
    and massn0.zieleinheit_anzahl is not null
  order by
    tpop0.id,
    massn0.jahr desc,
    massn0.datum desc
),
zaehljahre as (
  select distinct on (tpop2.id, kontr2.jahr)
    tpop2.id as tpop_id,
    kontr2.jahr,
    kontr2.id,
    ze2.text as zaehleinheit,
    zaehl2.anzahl
  from
    apflora.tpopkontrzaehl zaehl2
    inner join apflora.tpopkontr kontr2
      inner join apflora.tpop_history tpop2
        inner join apflora.pop_history pop2
          inner join apflora.ap_history ap2
            inner join apflora.ekzaehleinheit ekze2
              inner join apflora.tpopkontrzaehl_einheit_werte ze2
              on ze2.id = ekze2.zaehleinheit_id
            on ekze2.ap_id = ap2.id and ekze2.zielrelevant = true
          on ap2.id = pop2.ap_id
        on pop2.id = tpop2.pop_id 
      on tpop2.id = kontr2.tpop_id 
    on zaehl2.tpopkontr_id = kontr2.id and zaehl2.einheit = ze2.code
  where
    kontr2.jahr is not null
    and ap2.year = kontr2.jahr
    and pop2.year = kontr2.jahr
    and tpop2.year = kontr2.jahr
    and tpop2.status in (100, 200, 201)
    and zaehl2.anzahl is not null
    -- nur Zählungen mit der Ziel-Einheit
    and ze2.code = zaehl2.einheit
  order by
    tpop2.id,
    kontr2.jahr desc,
    kontr2.datum desc
),
tpop_mit_letzten as (
  select
    tpop3.id as tpop_id,
    tpop3.year as jahr,
    case
      when zj.jahr is not null and mj.jahr is not null and zj.jahr >= mj.jahr then 'zaehlung'
      when zj.jahr is not null and mj.jahr is not null and zj.jahr < mj.jahr then 'massnahme'
      when zj.jahr is not null then 'zaehlung'
      when mj.jahr is not null then 'massnahme'
      else null
    end as typ,
  case
    when zj.jahr is not null and mj.jahr is not null and zj.jahr >= mj.jahr then zj.id
    when zj.jahr is not null and mj.jahr is not null and zj.jahr < mj.jahr then mj.id
    when zj.jahr is not null then zj.id
    when mj.jahr is not null then mj.id
    else null
  end as id,
  case
    when zj.jahr is not null and mj.jahr is not null and zj.jahr >= mj.jahr then zj.zaehleinheit
    when zj.jahr is not null and mj.jahr is not null and zj.jahr < mj.jahr then mj.zaehleinheit
    when zj.jahr is not null then zj.zaehleinheit
    when mj.jahr is not null then mj.zaehleinheit
    else null
  end as zaehleinheit,
  case
    when zj.jahr is not null and mj.jahr is not null and zj.jahr >= mj.jahr then zj.anzahl
    when zj.jahr is not null and mj.jahr is not null and zj.jahr < mj.jahr then mj.anzahl
    when zj.jahr is not null then zj.anzahl
    when mj.jahr is not null then mj.anzahl
    else null
  end as anzahl
  from
    apflora.tpop_history as tpop3
    left join massnjahre as mj
    on mj.tpop_id = tpop3.id and mj.jahr = (select max(jahr) from massnjahre where massnjahre.jahr <= tpop3.year and massnjahre.tpop_id = tpop3.id)
    left join zaehljahre as zj
    on zj.tpop_id = tpop3.id and zj.jahr = (select max(jahr) from zaehljahre where zaehljahre.jahr <= tpop3.year and zaehljahre.tpop_id = tpop3.id)
  order by
    tpop3.id,
    tpop3.year
)
select * from tpop_mit_letzten











pop_data as (
  select
    ap.id as ap_id,
    ew.text as zaehleinheit,
    pop.year,
    pop.id as pop_id,
    count(tpop.id) as anzahl
    from
      apflora.pop_history pop
      inner join apflora.ap_history ap
        inner join apflora.ekzaehleinheit ekze
          inner join apflora.tpopkontrzaehl_einheit_werte ew
          on ekze.zaehleinheit_id = ew.id
        on ap.id = ekze.ap_id and ekze.zielrelevant = true
      on ap.id = pop.ap_id
      inner join apflora.tpop_history tpop
      on pop.id = tpop.pop_id
    where 
      pop.status in (100, 200, 201)
      and tpop.status in (100, 200, 201)
      and tpop.apber_relevant = true
    group by
      ap.id,
      ew.text,
      pop.year,
      pop.id
    order by
      ap.id,
      pop.year
  )
select
  ap_id,
  zaehleinheit,
  year as jahr,
  json_object_agg(pop_id, anzahl) as values
from pop_data
group by ap_id, zaehleinheit, year
order by ap_id, year;