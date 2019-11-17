with tpop_without as (
  select
    tpop.id,
    pop.status as pop_status,
    tpop.status as tpop_status,
    (
      select
        zaehl.anzahl
      from
        apflora.tpopkontr kontr
        inner join apflora.tpop
          inner join apflora.pop
            inner join apflora.ap
              inner join apflora.ekzaehleinheit
              on apflora.ap.id = apflora.ekzaehleinheit.ap_id and apflora.ekzaehleinheit.zielrelevant = true
            on apflora.ap.id = apflora.pop.ap_id
          on apflora.pop.id = apflora.tpop.pop_id
        on apflora.tpop.id = kontr.tpop_id
        inner join apflora.tpopkontrzaehl zaehl
        on zaehl.tpopkontr_id = kontr.id
      where
        kontr.tpop_id = tpop.id
        and kontr.jahr is not null
        and zaehl.einheit = (select code from apflora.tpopkontrzaehl_einheit_werte where id = apflora.ekzaehleinheit.zaehleinheit_id)
      order by
        jahr desc,
        datum desc
      limit 1
    ) as letzte_anzahl
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