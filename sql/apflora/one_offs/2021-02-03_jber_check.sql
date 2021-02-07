-- Bei Gagea pratensis ist die Differenz mit 0 angegeben, 
-- effektiv hat es aber gegenüber dem Vorjahr (Jahresbericht 2019) 2 zusätzliche ursprüngliche Populationen
with pop_2020 as (
  select
    pop.id,
    pop.nr,
    status_werte.text as status,
    bekannt_seit
  from apflora.pop as pop
    inner join apflora.pop_status_werte status_werte
    on pop.status = status_werte.code
  where
    pop.ap_id = '6c52d1d5-4f62-11e7-aebe-efe7798714be'
    and exists(
      select id 
      from apflora.tpop
      where 
        pop_id = pop.id
        and apber_relevant = true
        and (
          bekannt_seit <= 2020
          or bekannt_seit is null
        )
    )
  order by
    pop.nr
), pop_2019 as (
  select
    pop.id,
    pop.nr,
    status_werte.text as status,
    bekannt_seit
  from apflora.pop_history as pop
    inner join apflora.pop_status_werte status_werte
    on pop.status = status_werte.code
  where
    pop.ap_id = '6c52d1d5-4f62-11e7-aebe-efe7798714be'
    and year = 2019
    and exists(
      select id 
      from apflora.tpop
      where 
        pop_id = pop.id
        and apber_relevant = true
        and (
          bekannt_seit <= 2019
          or bekannt_seit is null
        )
    )
  order by
    pop.nr
)
select
  pop_2020.nr as pop_2020_nr,
  pop_2020.status as pop_2020_status,
  pop_2020.bekannt_seit as pop_2020_bekannt_seit,
  pop_2019.nr as pop_2019_nr,
  pop_2019.status as pop_2019_status,
  pop_2019.bekannt_seit as pop_2019_bekannt_seit,
  (pop_2020.status is distinct from pop_2019.status) as status_verändert
from pop_2020
  full outer join pop_2019
  on pop_2020.id = pop_2019.id
order by
  pop_2020.nr;




-- Bei Ophrys araneola sind die Zahlen (0 urspr. Pop, 9 anges. Pop, total 9 Pop) 
-- genau gleich wie im Vorjahr, d.h. Differenz = 0 (und nicht -1)
with pop_2020 as (
  select
    pop.id,
    pop.nr,
    status_werte.text as status,
    bekannt_seit
  from apflora.pop as pop
    inner join apflora.pop_status_werte status_werte
    on pop.status = status_werte.code
  where
    pop.ap_id = '6c52d250-4f62-11e7-aebe-a71b014ac715'
    and exists(
      select id 
      from apflora.tpop
      where 
        pop_id = pop.id
        and apber_relevant = true
        and (
          bekannt_seit <= 2020
          or bekannt_seit is null
        )
    )
  order by
    pop.nr
), pop_2019 as (
  select
    pop.id,
    pop.nr,
    status_werte.text as status,
    bekannt_seit
  from apflora.pop_history as pop
    inner join apflora.pop_status_werte status_werte
    on pop.status = status_werte.code
  where
    pop.ap_id = '6c52d250-4f62-11e7-aebe-a71b014ac715'
    and year = 2019
    and exists(
      select id 
      from apflora.tpop
      where 
        pop_id = pop.id
        and apber_relevant = true
        and (
          bekannt_seit <= 2019
          or bekannt_seit is null
        )
    )
  order by
    pop.nr
)
select
  pop_2020.nr as pop_2020_nr,
  pop_2020.status as pop_2020_status,
  pop_2020.bekannt_seit as pop_2020_bekannt_seit,
  pop_2019.nr as pop_2019_nr,
  pop_2019.status as pop_2019_status,
  pop_2019.bekannt_seit as pop_2019_bekannt_seit,
  (pop_2020.status is distinct from pop_2019.status) as status_verändert
from pop_2020
  full outer join pop_2019
  on pop_2020.id = pop_2019.id
order by
  pop_2020.nr;



-- Bei Pulsatilla vulgaris waren die Zahlen im Vorjahr: 
-- 10 ursp. Pop, 55 anges. Pop und total 65 Pop; 
-- die Differenz 2020 ist: -1 urspr. Pop, + 7 ang. Pop, total + 6 Pop (und nicht -1, 6, 5)
with pop_2020 as (
  select
    pop.id,
    pop.nr,
    status_werte.text as status,
    bekannt_seit
  from apflora.pop as pop
    inner join apflora.pop_status_werte status_werte
    on pop.status = status_werte.code
  where
    pop.ap_id = '6c52d29a-4f62-11e7-aebe-df2a375e3003'
    and exists(
      select id 
      from apflora.tpop
      where 
        pop_id = pop.id
        and apber_relevant = true
        and (
          bekannt_seit <= 2020
          or bekannt_seit is null
        )
    )
  order by
    pop.nr
), pop_2019 as (
  select
    pop.id,
    pop.nr,
    status_werte.text as status,
    bekannt_seit
  from apflora.pop_history as pop
    inner join apflora.pop_status_werte status_werte
    on pop.status = status_werte.code
  where
    pop.ap_id = '6c52d29a-4f62-11e7-aebe-df2a375e3003'
    and year = 2019
    and exists(
      select id 
      from apflora.tpop
      where 
        pop_id = pop.id
        and apber_relevant = true
        and (
          bekannt_seit <= 2019
          or bekannt_seit is null
        )
    )
  order by
    pop.nr
)
select
  pop_2020.nr as pop_2020_nr,
  pop_2020.status as pop_2020_status,
  pop_2020.bekannt_seit as pop_2020_bekannt_seit,
  pop_2019.nr as pop_2019_nr,
  pop_2019.status as pop_2019_status,
  pop_2019.bekannt_seit as pop_2019_bekannt_seit,
  (pop_2020.status is distinct from pop_2019.status) as status_verändert
from pop_2020
  full outer join pop_2019
  on pop_2020.id = pop_2019.id
order by
  pop_2020.nr;