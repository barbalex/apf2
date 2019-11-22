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
  and tpop.status not in (101, 202, 300)
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
  and tpop.status not in (101, 202, 300)
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

-- wir brauchen qk für EK-Frequenz ohne kontrolljahre_ab
-- wir brauchen qk für AP's ohne zielrelevante EK-Zähleinheit

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
            -- nur AP's berücksichtigen, bei denen eine EK-Zähleinheit als zielrelevant definiert wurde
            inner join apflora.ekzaehleinheit
            on apflora.ap.id = apflora.ekzaehleinheit.ap_id and apflora.ekzaehleinheit.zielrelevant = true
          on apflora.ap.id = apflora.pop.ap_id
        on apflora.pop.id = apflora.tpop.pop_id
      on apflora.tpop.id = apflora.tpopkontr.tpop_id
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
  where
    -- nur Kontrollen mit Jahr berücksichtigen
    apflora.tpopkontr.jahr is not null
    -- nur Zählungen mit zielrelevanter Einheit berücksichtigen
    and apflora.tpopkontrzaehl.einheit = (select code from apflora.tpopkontrzaehl_einheit_werte where id = apflora.ekzaehleinheit.zaehleinheit_id)
    -- nur Zählungen mit Anzahl berücksichtigen
	  and apflora.tpopkontrzaehl.anzahl is not null
  order by
    apflora.tpop.id,
    apflora.tpopkontr.jahr desc,
    apflora.tpopkontr.datum desc
)
  update apflora.tpop as tpop
  set ekfrequenz =
    case
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl < 20 -- stark gefährdet (< 20 Ind.)
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'GA'
      )
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl > 20 -- mittel gefährdet (> 20 Ind.)
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'GB'
      )
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl > 500 -- wenig gefährdet (> 500 Ind.)
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'GC'
      )
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl = 0 -- erloschen? (0 Ind.)
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'GD'
      )
      when
        pop.status = 200
        and tpop.status = 200
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'SA'
      )
      when
        pop.status = 100
        and tpop.status = 200
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'SB'
      )
      -- when pop.status in (100, 200) and tpop.status = 200 then 'D' 
      -- dieser Fall kann hier nicht von obigen zwei (SA, SB) unterschieden werden, oder?
      when
        tpop.status = 201
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'A'
      )
      else null
    end
  from apflora.tpop tpop
    -- nur TPop berücksichtigen, für die eine letzte Anzahl berechnet wurde
    inner join letzte_anzahl la
    on la.id = tpop.id
    -- nur TPop berücksichtigen, welche über Pop, AP und Taxonomie verfügen
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on ap.art_id = tax.id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  where
    -- nur TPop ohne ekfrequenz berücksichtigen
    tpop.ekfrequenz is null
    -- nur TPop von AP's mit bearbeitung 'erstellt', 'in Bearbeitung' oder 'vorgesehen' berücksichtigen
    and ap.bearbeitung < 4
    -- nur TPop, die nicht erloschen sind berücksichtigen
    and tpop.status not in (101, 202, 300)
    -- nur relevante TPop berücksichtigen
    and tpop.apber_relevant = true
    -- nur TPop von Nicht-Testarten berücksichtigen
    and tax.taxid > 150;










-- show result of query:
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
            -- nur AP's berücksichtigen, bei denen eine EK-Zähleinheit als zielrelevant definiert wurde
            inner join apflora.ekzaehleinheit
            on apflora.ap.id = apflora.ekzaehleinheit.ap_id and apflora.ekzaehleinheit.zielrelevant = true
          on apflora.ap.id = apflora.pop.ap_id
        on apflora.pop.id = apflora.tpop.pop_id
      on apflora.tpop.id = apflora.tpopkontr.tpop_id
    on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
  where
    -- nur Kontrollen mit Jahr berücksichtigen
    apflora.tpopkontr.jahr is not null
    -- nur Zählungen mit zielrelevanter Einheit berücksichtigen
    and apflora.tpopkontrzaehl.einheit = (select code from apflora.tpopkontrzaehl_einheit_werte where id = apflora.ekzaehleinheit.zaehleinheit_id)
    -- nur Zählungen mit Anzahl berücksichtigen
	  and apflora.tpopkontrzaehl.anzahl is not null
  order by
    apflora.tpop.id,
    apflora.tpopkontr.jahr desc,
    apflora.tpopkontr.datum desc
)
  select
    tax.artname,
    pop.nr as pop_nr,
    pop.status as pop_status,
    tpop.nr as tpop_nr,
    tpop.status as tpop_status,
    case
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl < 20 -- stark gefährdet (< 20 Ind.)
      then 'GA'
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl > 20 -- mittel gefährdet (> 20 Ind.)
      then 'GB'
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl > 500 -- wenig gefährdet (> 500 Ind.)
      then 'GC'
      when
        pop.status = 100
        and tpop.status = 100
        and la.anzahl = 0 -- erloschen? (0 Ind.)
      then 'GD'
      when
        pop.status = 200
        and tpop.status = 200
      then 'SA'
      when
        pop.status = 100
        and tpop.status = 200
      then 'SB'
      -- when pop.status in (100, 200) and tpop.status = 200 then 'D' 
      -- dieser Fall kann hier nicht von obigen zwei (SA, SB) unterschieden werden, oder?
      when
        tpop.status = 201
      then 'A'
      else null
    end as ekfrequenz_code
  from apflora.tpop tpop
    -- nur TPop berücksichtigen, für die eine letzte Anzahl berechnet wurde
    inner join letzte_anzahl la
    on la.id = tpop.id
    -- nur TPop berücksichtigen, welche über Pop, AP und Taxonomie verfügen
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on ap.art_id = tax.id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  where
    -- nur TPop ohne ekfrequenz berücksichtigen
    tpop.ekfrequenz is null
    -- nur TPop von AP's mit bearbeitung 'erstellt', 'in Bearbeitung' oder 'vorgesehen' berücksichtigen
    and ap.bearbeitung < 4
    -- nur TPop, die nicht erloschen sind berücksichtigen
    and tpop.status not in (101, 202, 300)
    -- nur relevante TPop berücksichtigen
    and tpop.apber_relevant = true
    -- nur TPop von Nicht-Testarten berücksichtigen
    and tax.taxid > 150
  order by
    tax.artname,
    pop.nr,
    tpop.nr;
  
  -- query ap-arten plus arten with ekplan without zielrelevante zähleinheit
  with ap_with_ekplan as (
    select distinct apflora.ap.id
    from
      apflora.ekplan
      inner join apflora.tpop
        inner join apflora.pop
          inner join apflora.ap
          on apflora.ap.id = apflora.pop.ap_id
        on apflora.pop.id = apflora.tpop.pop_id
      on apflora.tpop.id = apflora.ekplan.tpop_id
  )
  select
    tax.artname as ap,
    ew.text as zielrelevante_zaehleinheit
  from
    apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
      -- nur AP's berücksichtigen, bei denen eine EK-Zähleinheit als zielrelevant definiert wurde
      left join apflora.ekzaehleinheit ekze
        inner join apflora.tpopkontrzaehl_einheit_werte ew
        on ew.id = ekze.zaehleinheit_id
      on ap.id = ekze.ap_id and ekze.zielrelevant = true
  where
    ap.bearbeitung < 4
    or ap.id in (select * from ap_with_ekplan)
  order by
    tax.artname;