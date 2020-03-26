


DROP VIEW IF EXISTS apflora.v_ap_ausw_pop_zielrelev_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw_pop_zielrelev_einheit AS

with
massnjahre as (
  select distinct on (tpop0.id, massn0.jahr)
    tpop0.id as tpop_id,
    massn0.jahr,
    massn0.id as massn_id,
    ze0.text as zaehleinheit,
    massn0.zieleinheit_anzahl as anzahl
  from 
    apflora.tpopmassn massn0
      inner join apflora.tpopmassn_typ_werte tw
      on tw.code = massn0.typ and tw.anpflanzung = true
    inner join apflora.tpop tpop0
      inner join apflora.pop pop0
        inner join apflora.ap ap0
          inner join apflora.ekzaehleinheit ekze0
            inner join apflora.tpopkontrzaehl_einheit_werte ze0
            on ze0.id = ekze0.zaehleinheit_id
          on ekze0.ap_id = ap0.id and ekze0.zielrelevant = true
        on ap0.id = pop0.ap_id
      on pop0.id = tpop0.pop_id
    on tpop0.id = massn0.tpop_id
  where
    massn0.jahr is not null
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
    kontr2.id as kontr_id,
    ze2.text as zaehleinheit,
    zaehl2.anzahl
  from
    apflora.tpopkontrzaehl zaehl2
    inner join apflora.tpopkontr kontr2
      inner join apflora.tpop tpop2
        inner join apflora.pop pop2
          inner join apflora.ap ap2
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
    and tpop2.status in (100, 200, 201)
    and zaehl2.anzahl is not null
    -- nur Zählungen mit der Ziel-Einheit
    and ze2.code = zaehl2.einheit
  order by
    tpop2.id,
    kontr2.jahr desc,
    kontr2.datum desc
),
jahre as (
  select generate_series(
    (select jahr from massnjahre union select jahr from zaehljahre order by jahr asc limit 1)::int,
    extract(year from now())::int
  ) as jahr
),
tpop_ids as (
  select tpop_id from massnjahre 
  union select tpop_id from zaehljahre 
  order by tpop_id
),
tpops_with_year as (
  select tpop_id, jahr from tpop_ids, jahre
  order by tpop_id, jahr
),
letzte_zaehlung_oder_kontrolle as (
  select
    ty.jahr,
    ty.tpop_id,
    (select jahr from massnjahre where jahr <= ty.jahr order by jahr desc limit 1) as last_massnahmenjahr,
    (select jahr from zaehljahre where jahr <= ty.jahr order by jahr desc limit 1) as last_zaehlungjahr
  from 
    tpops_with_year ty
    left join massnjahre mj
    on mj.jahr = ty.jahr and mj.tpop_id = ty.tpop_id
    left join zaehljahre zj
    on zj.jahr = ty.jahr and zj.tpop_id = ty.tpop_id
)
select * from letzte_zaehlung_oder_kontrolle



letzte_ansiedlung as (
  select distinct on (tpop4.id, massn4.jahr)
    tpop4.id as tpop_id,
    massn4.jahr,
    massn4.id as massn_id,
    ze4.text as zaehleinheit,
    massn4.zieleinheit_anzahl as anzahl
  from
    apflora.tpopmassn massn4
    inner join apflora.tpop tpop4
      inner join apflora.pop pop4
        inner join apflora.ap ap4
          inner join apflora.ekzaehleinheit ekze4
            inner join apflora.tpopkontrzaehl_einheit_werte ze4
            on ze4.id = ekze4.zaehleinheit_id
          on ekze4.ap_id = ap4.id and ekze4.zielrelevant = true
        on ap4.id = pop4.ap_id
      on pop4.id = tpop4.pop_id
    on tpop4.id = massn4.tpop_id
    inner join apflora.tpopmassn_typ_werte
    on apflora.tpopmassn_typ_werte.code = massn4.typ
  where
    massn4.jahr is not null
    and tpop4.status in (200, 201)
    and tpopmassn_typ_werte.anpflanzung = true
    and massn4.zieleinheit_einheit = ze4.code
    and massn4.zieleinheit_anzahl is not null
  order by
    tpop4.id,
    massn4.jahr desc,
    massn4.datum desc
), 
letzte_zaehlung as (
  select distinct on (tpop5.id, kontr5.jahr)
    tpop5.id as tpop_id,
    kontr5.jahr,
    kontr5.id as kontr_id,
    apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
    zaehl5.anzahl
  from
    apflora.tpopkontrzaehl zaehl5
    inner join apflora.tpopkontrzaehl_einheit_werte
    on apflora.tpopkontrzaehl_einheit_werte.code = zaehl5.einheit
    inner join apflora.tpopkontr kontr5
      inner join apflora.tpop tpop5
        inner join apflora.pop pop5
          inner join apflora.ap ap5
            inner join apflora.ekzaehleinheit ekze5
              inner join apflora.tpopkontrzaehl_einheit_werte ze5
              on ze5.id = ekze5.zaehleinheit_id
            on ekze5.ap_id = ap5.id and ekze5.zielrelevant = true
          on ap5.id = pop5.ap_id
        on pop5.id = tpop5.pop_id
      on tpop5.id = kontr5.tpop_id
    on zaehl5.tpopkontr_id = kontr5.id
  where
    -- nur Kontrollen mit Jahr berücksichtigen
    kontr5.jahr is not null
    -- nur Zählungen mit der Ziel-Einheit
    and ze5.code = zaehl5.einheit
    -- nur Zählungen mit Anzahl berücksichtigen
    and zaehl5.anzahl is not null
  order by
    tpop5.id,
    kontr5.jahr desc,
    kontr5.datum desc
)
select
  tpop.id
from
  apflora.tpop tpop
  left join letzte_ansiedlung la
  on la.tpop_id = tpop.id
  left join letzte_zaehlung lz
  on lz.tpop_id = tpop.id








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