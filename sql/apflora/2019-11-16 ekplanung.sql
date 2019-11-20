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
-- we need qk for no zielrelevante ekfrequenz

-- set missing ekfrequenz
with letzte_anzahl as (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id,
    apflora.tpopkontrzaehl.anzahl
  from
    apflora.tpopkontrzaehl
    inner join apflora.tpopkontr
      inner join apflora.tpop
        inner join apflora.pop
          inner join apflora.ap
            inner join apflora.ekzaehleinheit
            on apflora.ap.id = apflora.ekzaehleinheit.ap_id and apflora.ekzaehleinheit.zielrelevant = true
          on apflora.ap.id = apflora.pop.ap_id
        on apflora.pop.id = apflora.tpop.pop_id
      on apflora.tpop.id = apflora.tpopkontr.tpop_id
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
  where
    apflora.tpopkontr.jahr is not null
    and apflora.tpopkontrzaehl.einheit = (select code from apflora.tpopkontrzaehl_einheit_werte where id = apflora.ekzaehleinheit.zaehleinheit_id)
    -- exclude zahlungen with no anzahl
	  and apflora.tpopkontrzaehl.anzahl is not null
  order by
    apflora.tpop.id,
    apflora.tpopkontr.jahr desc,
    apflora.tpopkontr.datum desc
) tpop_without as (
  select
    tpop.id,
    pop.status as pop_status,
    tpop.status as tpop_status,
    la.anzahl as letzte_anzahl
  from apflora.tpop tpop
    inner join letzte_anzahl la
    on la.id = tpop.id
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
        pop_status = 100
        and tpop_status = 100
        and 'TODO: stark gefährdet (< 20 Ind.)'
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'GA'
      )
      when
        pop_status = 100
        and tpop_status = 100
        and 'TODO: mittel gefährdet (> 20 Ind.)'
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'GB'
      )
      when
        pop_status = 100
        and tpop_status = 100
        and 'TODO: wenig gefährdet (> 500 Ind.)'
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'GC'
      )
      when
        pop_status = 100
        and tpop_status = 100
        and 'TODO: erloschen? (0 Ind.)'
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'GD'
      )
      when
        pop_status = 200
        and tpop_status = 200
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'SA'
      )
      when
        pop_status = 100
        and tpop_status = 200
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'SB'
      )
      --when pop_status in (100, 200) and tpop_status = 200 then 'D' -- do not set because is special case?
      when
        tpop_status = 201
      then (
        select id
        from apflora.ekrequenz
        where
          ap_id = ap.id
          and code = 'A'
      )
      else null
    end
  where id in (select id from tpop_without);