refresh materialized view apflora.v_ap_ausw_pop_menge;
DROP materialized VIEW IF EXISTS apflora.v_ap_ausw_pop_menge CASCADE;
CREATE materialized VIEW apflora.v_ap_ausw_pop_menge AS
with
massnjahre as (
  select distinct on (tpop0.id, massn0.jahr)
    tpop0.id as tpop_id,
    massn0.jahr,
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
        on ap0.id = pop0.ap_id and ap0.year = pop0.year
      on pop0.id = tpop0.pop_id and pop0.year = tpop0.year
    on tpop0.id = massn0.tpop_id and tpop0.year = massn0.jahr
  where
    massn0.jahr is not null
    and tpop0.status in (200, 201)
    and tpop0.apber_relevant = true
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
          on ap2.id = pop2.ap_id and ap2.year = pop2.year
        on pop2.id = tpop2.pop_id and pop2.year = tpop2.year
      on tpop2.id = kontr2.tpop_id and tpop2.year = kontr2.jahr
    on zaehl2.tpopkontr_id = kontr2.id and zaehl2.einheit = ze2.code
  where
    kontr2.jahr is not null
    and tpop2.status in (100, 200, 201)
    and tpop2.apber_relevant = true
    and zaehl2.anzahl is not null
    -- nur Zählungen mit der Ziel-Einheit
    and ze2.code = zaehl2.einheit
  order by
    tpop2.id,
    kontr2.jahr desc,
    kontr2.datum desc
),
tpop_letzte_menge as (
  select
    tpop3.id as tpop_id,
    tpop3.year as jahr,
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
),
pop_data as (
  select
    ap4.id as ap_id,
    pop4.year as jahr,
    pop4.id as pop_id,
    sum(anzahl) as anzahl
  from 
    tpop_letzte_menge tplm
    inner join apflora.tpop_history tpop4
      inner join apflora.pop_history pop4
        inner join apflora.ap_history ap4
        on ap4.id = pop4.ap_id and ap4.year = pop4.year
      on pop4.id = tpop4.pop_id and pop4.year = tpop4.year
    on tpop4.id = tplm.tpop_id and tpop4.year = tplm.jahr
  where
    pop4.status in (100, 200, 201)
	  and tplm.anzahl is not null
  group by
    ap4.id,
    pop4.year,
    pop4.id
  order by
    ap4.id,
    pop4.year
)
select
  ap_id,
  jahr,
  json_object_agg(pop_id, anzahl) as values
from pop_data
group by ap_id, jahr
order by ap_id, jahr;

