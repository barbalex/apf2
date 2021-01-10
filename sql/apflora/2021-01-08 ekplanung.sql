drop view if exists apflora.v_tpop_ekfrequenz_to_set cascade;
create or replace view apflora.v_tpop_ekfrequenz_to_set as
with letzte_kontrolle as (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id as tpop_id,
    apflora.tpopkontr.jahr,
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
),
letzte_ansiedlung as (
  -- TODO: 
  -- if tpop.status === 201 (Ansaatversuch): choose first ansaat
  -- else: choose last anpflanzung
  select distinct on (apflora.tpop.id)
    apflora.tpop.id as tpop_id,
    apflora.tpopmassn.jahr
  from
    apflora.tpopmassn
    inner join apflora.tpopmassn_typ_werte
    on apflora.tpopmassn_typ_werte.code = apflora.tpopmassn.typ
    inner join apflora.tpop
    on apflora.tpop.id = apflora.tpopmassn.tpop_id
  where
    -- nur Massnahmen mit Jahr berücksichtigen
    apflora.tpopmassn.jahr is not null
    -- nur Massnahmen vom Typ Ansiedlung berücksichtigen
    and apflora.tpopmassn.typ > 0
    and apflora.tpopmassn.typ < 4
  order by
    apflora.tpop.id,
    apflora.tpopmassn.jahr desc,
    apflora.tpopmassn.datum desc
),
tpop_plus as (
  select
    tpop.id as tpop_id,
    lk.jahr,
    lk.anzahl as letzte_anzahl,
    case
      when
        pop.status = 100
        and tpop.status = 100
        and lk.anzahl = 0 -- erloschen? (0 Ind.)
      then 'GD'
      when
        pop.status = 100
        and tpop.status = 100
        and lk.anzahl > 0
        and lk.anzahl < 20 -- stark gefährdet (< 20 Ind.)
      then 'GA'
      when
        pop.status = 100
        and tpop.status = 100
        and lk.anzahl > 20 -- mittel gefährdet (> 20 Ind.)
        and lk.anzahl <= 500
      then 'GB'
      when
        pop.status = 100
        and tpop.status = 100
        and lk.anzahl > 500 -- wenig gefährdet (> 500 Ind.)
      then 'GC'
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
    end as ekfrequenz_code,
    case
      when
        pop.status = 100
        and tpop.status = 100
        and lk.anzahl = 0 -- erloschen? (0 Ind.)
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'GD'
      )
      when
        pop.status = 100
        and tpop.status = 100
        and lk.anzahl > 0
        and lk.anzahl < 20 -- stark gefährdet (< 20 Ind.)
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
        and lk.anzahl > 20 -- mittel gefährdet (> 20 Ind.)
        and lk.anzahl <= 500
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
        and lk.anzahl > 500 -- wenig gefährdet (> 500 Ind.)
      then (
        select id
        from apflora.ekfrequenz
        where
          ap_id = ap.id
          and code = 'GC'
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
    end as ekfrequenz
  from apflora.tpop tpop
    -- nur TPop berücksichtigen, für die eine letzte Anzahl berechnet wurde
    left join letzte_kontrolle lk
    on lk.tpop_id = tpop.id
    -- nur TPop berücksichtigen, welche über Pop, AP und Taxonomie verfügen
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on ap.art_id = tax.id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  where
    -- nur TPop ohne ekfrequenz und startjahr berücksichtigen
    tpop.ekfrequenz is null
    and tpop.ekfrequenz_startjahr is null
    -- nur TPop von AP's mit bearbeitung 'erstellt', 'in Bearbeitung' oder 'vorgesehen' berücksichtigen
    --and ap.bearbeitung < 4
    -- nur TPop, die nicht erloschen sind berücksichtigen
    and tpop.status not in (101, 202, 300)
    -- nur relevante TPop berücksichtigen
    and tpop.apber_relevant = true
    and tax.taxid > 150
), ap_with_ekfrequenz as (
  select distinct pop.ap_id as id 
  from apflora.tpop tpop
    inner join apflora.pop pop
    on tpop.pop_id = pop.id
  where
    tpop.ekfrequenz is not null
)
select
    tax.artname,
    ap.id as ap_id,
    pop.nr as pop_nr,
    pop.status as pop_status,
    tpop.id as tpop_id,
    tpop.nr as tpop_nr,
    tpop.status as tpop_status,
    ekf.kontrolljahre_ab,
    -- ekfrequenz_startjahr depends on letze_kontrolle OR letzte_ansiedlung depending on kontrolljahre_ab
    case
      when ekf.kontrolljahre_ab = 'ek' then tp.jahr
      when ekf.kontrolljahre_ab = 'ansiedlung' then la.jahr
      else null
    end as ekfrequenz_startjahr,
    case
      when ekf.kontrolljahre_ab = 'ek' then tp.letzte_anzahl
      else null
    end as letzte_anzahl,
    tp.ekfrequenz_code,
    tp.ekfrequenz
  from apflora.tpop tpop
    -- nur TPop berücksichtigen, für die eine letzte Kontrolle berechnet wurde
    inner join tpop_plus tp
      inner join apflora.ekfrequenz ekf
      on ekf.id = tp.ekfrequenz
    on tp.tpop_id = tpop.id
    left join letzte_ansiedlung la
    on la.tpop_id = tpop.id
    -- nur TPop berücksichtigen, welche über Pop, AP und Taxonomie verfügen
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on ap.art_id = tax.id
        inner join ap_with_ekfrequenz
        on ap_with_ekfrequenz.id = ap.id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  order by
    tax.artname,
    pop.nr,
    tpop.nr;

update apflora.tpop
set 
  ekfrequenz_startjahr = apflora.v_tpop_ekfrequenz_to_set.ekfrequenz_startjahr,
  ekfrequenz = apflora.v_tpop_ekfrequenz_to_set.ekfrequenz
from apflora.v_tpop_ekfrequenz_to_set
where apflora.tpop.id = apflora.v_tpop_ekfrequenz_to_set.tpop_id;

-- Wäre es möglich, dass bei den dieses Jahr neu erloschenen Teilpopulationen die EK-Frequenz "nie" gesetzt wird?
drop view if exists apflora.v_tpop_ekfrequenz_to_set_nie cascade;
create or replace view apflora.v_tpop_ekfrequenz_to_set_nie as
select 
  tax.artname,
  pop.nr as pop_nr,
  tpop.id,
  tpop.nr,
  tpop.status as status_code,
  status_werte.text as status_text,
  tpophist.status as status_code_2019,
  status_werte_hist.text as status_text_2019,
  tpop.ekfrequenz as ekfrequenz_id,
  ekfrequenz.code as ekfrequenz_code,
  ekfrequenz_to_set.id as ekfrequenz_to_set_id,
  ekfrequenz_to_set.code as ekfrequenz_to_set_code
from apflora.tpop tpop
  inner join apflora.tpop_history tpophist
    inner join apflora.pop_status_werte status_werte_hist
    on tpophist.status = status_werte_hist.code
  on tpop.id = tpophist.id and tpophist.year = 2019
  left join apflora.ekfrequenz ekfrequenz
  on ekfrequenz.id = tpop.ekfrequenz
  inner join apflora.pop_status_werte status_werte
  on tpop.status = status_werte.code
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on tax.id = ap.art_id
      inner join apflora.ekfrequenz ekfrequenz_to_set
      on ekfrequenz_to_set.ap_id = ap.id and ekfrequenz_to_set.code = 'nie (EK)'
    on ap.id = pop.ap_id
  on pop.id = tpop.pop_id
WHERE
  tpop.status in (101, 202)
  and tpophist.status not in (101, 202)
  and (
    -- ensure they are still named like this:
    ekfrequenz.code not in ('nie (EK)', 'nie (EKF)')
    or tpop.ekfrequenz is null
  )
  and ap.id in (
    select distinct pop.ap_id as id 
    from apflora.tpop tpop
      inner join apflora.pop pop
      on tpop.pop_id = pop.id
    where tpop.ekfrequenz is not null
  )
order by
  tax.artname,
  pop.nr,
  tpop.id,
  tpop.nr;


update apflora.tpop tpop
set ekfrequenz = (
  select ekfrequenz_to_set_id from apflora.v_tpop_ekfrequenz_to_set_nie nie
  where nie.id = tpop.id
)
where tpop.id in (select distinct id from apflora.v_tpop_ekfrequenz_to_set_nie);



with kontrolljahre as (
  select
    tpop1.id,
    apflora.ekfrequenz.ektyp,
    tpop1.ekfrequenz_startjahr, 
    unnest(apflora.ekfrequenz.kontrolljahre) as kontrolljahr
  from
    apflora.tpop tpop1
    inner join apflora.ekfrequenz
    on apflora.ekfrequenz.id = tpop1.ekfrequenz
  where
    tpop1.ekfrequenz is not null
    and tpop1.ekfrequenz_startjahr is not null
    and apflora.ekfrequenz.kontrolljahre is not null
    and (
      select count(*)
      from apflora.ekplan
      where tpop_id = tpop1.id
    ) = 0
  order by
    tpop1.id,
    tpop1.ekfrequenz_startjahr
),
ekplans as (
  select
    id as tpop_id,
    kontrolljahr + ekfrequenz_startjahr as jahr,
    ektyp as typ,
    '2021-01-10' as changed,
    'ag' as changed_by
  from
    kontrolljahre
)
insert into apflora.ekplan(tpop_id,jahr,typ,changed,changed_by)
select
  tpop_id,
  jahr,
  typ::ek_type,
  changed::date,
  changed_by
from ekplans;

-- to show before updating:
with kontrolljahre as (
  select
    tpop1.id,
    apflora.ekfrequenz.ektyp,
    tpop1.ekfrequenz_startjahr, 
    unnest(apflora.ekfrequenz.kontrolljahre) as kontrolljahr
  from
    apflora.tpop tpop1
    inner join apflora.ekfrequenz
    on apflora.ekfrequenz.id = tpop1.ekfrequenz
  where
    (
      tpop1.ekfrequenz is not null
      and tpop1.ekfrequenz_startjahr is not null
      and apflora.ekfrequenz.kontrolljahre is not null
      and (
        select count(*)
        from apflora.ekplan
        where tpop_id = tpop1.id
      ) = 0
    )
  order by
    tpop1.id,
    tpop1.ekfrequenz_startjahr
),
ekplans as (
  select
    id as tpop_id,
    kontrolljahr + ekfrequenz_startjahr as jahr,
    ektyp as typ,
    '2021-01-10' as changed,
    'ag' as changed_by
  from
    kontrolljahre
)
select
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  ekplans.jahr,
  ekplans.typ
from ekplans
inner join apflora.tpop tpop
  inner join apflora.pop pop
    inner join apflora.ap ap
      inner join apflora.ae_taxonomies tax
      on ap.art_id = tax.id
    on ap.id = pop.ap_id
  on pop.id = tpop.pop_id
on tpop.id = ekplans.tpop_id
order by
  tax.artname,
  pop.nr,
  tpop.nr,
  jahr;