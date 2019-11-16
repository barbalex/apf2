-- tpop without ekfrequenz
select
  tax.artname,
  pop.nr,
  tpop.nr
from apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on ap.id = pop.ap_id
  on pop.id = tpop.pop_id
where
  -- ohne ekfrequenz
  tpop.ekfrequenz is null
  -- nur mit ap
  and ap.bearbeitung < 4
  -- ohne erloschene
  and tpop.status not in (101, 202)
  -- ohne nicht relevante
  and tpop.apber_relevant = true
  -- ohne Testarten
  and tax.taxid > 150
order by
  tax.artname,
  pop.nr,
  tpop.nr;

-- tpop von ap mit ekfrequenz aber in Zukunft fehlenden ekplan
select
  tax.artname,
  pop.nr,
  tpop.nr
from apflora.tpop tpop
  inner join apflora.ekfrequenz ekf
  on ekf.id = tpop.ekfrequenz
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on ap.id = pop.ap_id
  on pop.id = tpop.pop_id
where
  -- EK-Frequenz erfordert Kontrollen
  cardinality(ekf.kontrolljahre) is not null
  -- ekf.kontrolljahre_ab ist definiert
  and ekf.kontrolljahre_ab is not null
  -- erforderliche Kontrolljahre liegen in der Zukunft
  and case 
    -- startjahr letzte ek
    when ekf.kontrolljahre_ab = 'ek'
    then (
      (select jahr from apflora.tpopkontr where tpop_id = tpop.id order by jahr desc limit 1)
      + (select max(x) from unnest(ekf.kontrolljahre) as x)
    ) > date_part('year', CURRENT_DATE)
    -- startjahr letzte ansiedlung
    else (
      (select jahr from apflora.tpopmassn where tpop_id = tpop.id and typ < 4 order by jahr desc limit 1)
      + (select max(x) from unnest(ekf.kontrolljahre) as x)
    ) > date_part('year', CURRENT_DATE)
  end
  -- in der Zukunft sind keine Kontrollen geplant
  and not exists (
    select * from apflora.ekplan 
    where 
      tpop_id = tpop.id
      and jahr > date_part('year', CURRENT_DATE)
  )
  -- nur mit ap
  and ap.bearbeitung < 4
  -- ohne erloschene
  and tpop.status not in (101, 202)
  -- ohne nicht relevante
  and tpop.apber_relevant = true
  -- ohne abweichende ek-frequenz
  and tpop.ekfrequenz_abweichend = false
  -- ohne Testarten
  and tax.taxid > 150
order by
  tax.artname,
  pop.nr,
  tpop.nr;

-- we need qk for ekfrequenz without kontrolljahre_ab

-- set missing ekfrequenz
with tpop_without as (
  select
    tpop.id
  from apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on ap.art_id = tax.id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  where
    -- ohne ekfrequenz
    tpop.ekfrequenz is null
    -- nur mit ap
    and ap.bearbeitung < 4
    -- ohne erloschene
    and tpop.status not in (101, 202)
    -- ohne nicht relevante
    and tpop.apber_relevant = true
    -- ohne Testarten
    and tax.taxid > 150
  )
  update apflora.tpop as tpop
  set ekfrequenz =
    case
      when
        pop.status = 100
        and tpop.status = 100
        and 'TODO: stark gefährdet (< 20 Ind.)'
      then 'GA'
      when
        pop.status = 100
        and tpop.status = 100
        and 'TODO: mittel gefährdet (> 20 Ind.)'
      then 'GB'
      when
        pop.status = 100
        and tpop.status = 100
        and 'TODO: wenig gefährdet (> 500 Ind.)'
      then 'GC'
      when
        pop.status = 100
        and tpop.status = 100
        and 'TODO: erloschen? (0 Ind.)'
      then 'GD'
      when pop.status = 200 and tpop.status = 200 then 'SA'
      when pop.status = 100 and tpop.status = 200 then 'SB'
      --when pop.status in (100, 200) and tpop.status = 200 then 'D' -- do not set because is special case?
      when tpop.status = 201 then 'A'
      else null
    end
  where id in (select id from tpop_without);