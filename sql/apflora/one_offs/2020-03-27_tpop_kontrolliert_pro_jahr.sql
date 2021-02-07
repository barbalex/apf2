
DROP VIEW IF EXISTS apflora.v_ap_ausw_tpop_kontrolliert CASCADE;
CREATE VIEW apflora.v_ap_ausw_tpop_kontrolliert AS
with
anpflanz as (
  select distinct on (tpop0.id, massn0.jahr)
    tpop0.id as tpop_id,
    massn0.jahr
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
    massn0.jahr desc
),
kontr as (
  select distinct on (tpop2.id, kontr2.jahr)
    tpop2.id as tpop_id,
    kontr2.jahr
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
    kontr2.jahr desc
),
kontr_oder_anpflanz as (
  select * from kontr
  union select * from anpflanz
),
tpop_data as (
  select
    ap4.id as ap_id,
    pop4.year as jahr,
    tpop4.id as tpop_id,
    case
      when koa.tpop_id is not null then 1
      else 0
    end as kontrolliert
  from 
    kontr_oder_anpflanz koa
    right join apflora.tpop_history tpop4
      inner join apflora.pop_history pop4
        inner join apflora.ap_history ap4
        on ap4.id = pop4.ap_id and ap4.year = pop4.year
      on pop4.id = tpop4.pop_id and pop4.year = tpop4.year
    on tpop4.id = koa.tpop_id and tpop4.year = koa.jahr
  where
    pop4.status in (100, 200, 201)
    and tpop4.status in (100, 200, 201)
    and tpop4.apber_relevant = true
  order by
    ap4.id,
    pop4.year
)
select
  ap_id,
  jahr,
  count(tpop_id)::int as anzahl_tpop,
  sum(kontrolliert)::int as anzahl_kontrolliert
from tpop_data
group by
  ap_id,
  jahr
order by
  ap_id,
  jahr;