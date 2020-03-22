-- Wenn die zielrelevante Einheit "Triebe" ist, dann könnten die bisherigen "Anzahlen Triebe" dort hinein kopiert werden. 
-- Dasselbe bei "Pflanzen"
-- zusätzlich: wenn tpopmassn.typ anpflanzung ist (2, 3)

--1. triebe
select massn.id, massn.anz_triebe, eh.text as zieleinheit_text, eh.code as zieleinheit_code
from
  apflora.tpopmassn massn
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ekzaehleinheit ekze
          inner join apflora.tpopkontrzaehl_einheit_werte eh
          on ekze.zaehleinheit_id = eh.id and eh.id = 'ddf9e946-3dc8-11e8-acca-fb443f718fbd' -- Triebe total
        on ap.id = ekze.ap_id and ekze.zielrelevant = true
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = massn.tpop_id
where
  massn.typ in (2, 3)
  and massn.anz_triebe is not null


--2. pflanzen
select massn.id, massn.anz_pflanzen, eh.text as zieleinheit_text, eh.code as zieleinheit_code
from
  apflora.tpopmassn massn
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ekzaehleinheit ekze
          inner join apflora.tpopkontrzaehl_einheit_werte eh
          on ekze.zaehleinheit_id = eh.id and eh.id = 'ddf9e944-3dc8-11e8-acca-a74bfdad0083' -- Pflanzen total
        on ap.id = ekze.ap_id and ekze.zielrelevant = true
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = massn.tpop_id
where
  massn.typ in (2, 3)
  and massn.anz_pflanzen is not null