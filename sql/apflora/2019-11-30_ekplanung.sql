
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
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  order by
    tax.artname,
    pop.nr,
    tpop.nr;

update apflora.tpop
set ekfrequenz_startjahr = apflora.v_tpop_ekfrequenz_to_set.ekfrequenz_startjahr
from apflora.v_tpop_ekfrequenz_to_set
-- nur noch dieses mal?
where ap_id in ('6c52d173-4f62-11e7-aebe-2bd3a2ea4576', '6c52d126-4f62-11e7-aebe-cbb8319e1712', '6c52d134-4f62-11e7-aebe-f78ab946ed4e', '6c52d14b-4f62-11e7-aebe-13080d6c3ca2', '6c52d15d-4f62-11e7-aebe-d3ebe63c98ce', '6c52d16c-4f62-11e7-aebe-bf479a922be9', '6c52d33a-4f62-11e7-aebe-c362ab7bf00c', '6c52d17a-4f62-11e7-aebe-735510824f5c', '6c52d17c-4f62-11e7-aebe-1fc9d4d8081b', '6c52d1ab-4f62-11e7-aebe-0bac47bfd0e2', '6c52d1c5-4f62-11e7-aebe-0ba4179b00ef', '6c52d1d2-4f62-11e7-aebe-0f4a6fd6302d', '6c52d1d5-4f62-11e7-aebe-efe7798714be', '6c52d1d6-4f62-11e7-aebe-ff9a1728b3c2', '6c52d335-4f62-11e7-aebe-5325f98ff13e', '6c52d1e6-4f62-11e7-aebe-d365c4f34069', '6c52d1f6-4f62-11e7-aebe-dfe3eaf910cc', '6c52d1fb-4f62-11e7-aebe-1f005b242e3b', '6c52d1ff-4f62-11e7-aebe-ebb98d6fc3cd', '6c52d200-4f62-11e7-aebe-334a20278a47', '6c52d223-4f62-11e7-aebe-e3ef9e657ec9', '6c52d245-4f62-11e7-aebe-0319a140fe46', '6c52d24a-4f62-11e7-aebe-3b1fea21f435', '6c52d250-4f62-11e7-aebe-a71b014ac715', '6c52d25d-4f62-11e7-aebe-4719a1363629', '6c52d28b-4f62-11e7-aebe-1772be4a5746', '6c52d28e-4f62-11e7-aebe-7f7763f755a8', '6c52d28f-4f62-11e7-aebe-af6c305c3118', '6c52d290-4f62-11e7-aebe-4b95be9a1ab4', '6c52d29a-4f62-11e7-aebe-df2a375e3003', '6c52d2aa-4f62-11e7-aebe-07d8f7f7a15f', '6c52d336-4f62-11e7-aebe-b3f4fb153660', '6c52d2f0-4f62-11e7-aebe-138e69662b58', '6c52d2c5-4f62-11e7-aebe-1bae8687d749', '6c52d2d8-4f62-11e7-aebe-9b85b2bde977', '6c52d2f1-4f62-11e7-aebe-c357c17496bc', '6c52d2e6-4f62-11e7-aebe-7f6df0551226', '6c52d2e9-4f62-11e7-aebe-333ee57f5b45', '6c52d2fa-4f62-11e7-aebe-631cf4b57c2b', '6c52d2ff-4f62-11e7-aebe-dfaa30dbe005', '6c52d300-4f62-11e7-aebe-37a15e739517', '6c52d142-4f62-11e7-aebe-13d6fdd1c0e7', '6c52d30b-4f62-11e7-aebe-73528305a058', '6c52d344-4f62-11e7-aebe-8fd26f1c01cf', '6c52d1e2-4f62-11e7-aebe-13e4d5d74aaf', '6c52d31a-4f62-11e7-aebe-774437534c00', '6c52d225-4f62-11e7-aebe-b3e2d7efa4b5', '6c52d345-4f62-11e7-aebe-ef496a1afa23', '6c52d347-4f62-11e7-aebe-8b160a649947', '6c52d30a-4f62-11e7-aebe-17661b30ebf2', '6c52d346-4f62-11e7-aebe-c79e12a0ff58', '6c52d348-4f62-11e7-aebe-9be0ec6227b2', '6c52d30c-4f62-11e7-aebe-2fdf30155710')
and apflora.tpop.id = apflora.v_tpop_ekfrequenz_to_set.tpop_id;