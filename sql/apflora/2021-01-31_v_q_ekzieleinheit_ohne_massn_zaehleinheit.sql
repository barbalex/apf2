select
  tax.artname,
  --ekzaehleinheit.ap_id,
  --ekzaehleinheit.zaehleinheit_id,
  zaehl_einheit_werte.text as zaehleinheit,
  ekzaehleinheit.zielrelevant,
  ekzaehleinheit.not_massn_count_unit as entspricht_keiner_massnahmen_zaehleinheit,
  zaehl_einheit_werte.corresponds_to_massn_anz_triebe as entspricht_anzahl_triebe_in_massnahmen,
  zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen as entspricht_anzahl_pflanzen_in_massnahmen
from apflora.ekzaehleinheit ekzaehleinheit
  inner join apflora.ap ap
    inner join apflora.ae_taxonomies tax
    on tax.id = ap.art_id
  on ap.id = ekzaehleinheit.ap_id
  inner join apflora.tpopkontrzaehl_einheit_werte zaehl_einheit_werte
  on zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id
where
  ekzaehleinheit.zielrelevant = true
  and ekzaehleinheit.not_massn_count_unit = false
  and zaehl_einheit_werte.corresponds_to_massn_anz_triebe = false
  and zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = false
order by
  tax.artname,
  zaehl_einheit_werte.text;


DROP VIEW IF EXISTS apflora.v_q_ekzieleinheit_ohne_massn_zaehleinheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_ekzieleinheit_ohne_massn_zaehleinheit AS
select
  ap.proj_id,
  ekzaehleinheit.ap_id,
  ekzaehleinheit.id,
  --ekzaehleinheit.zaehleinheit_id,
  tax.artname,
  zaehl_einheit_werte.text as zaehleinheit
from apflora.ekzaehleinheit ekzaehleinheit
  inner join apflora.ap ap
    inner join apflora.ae_taxonomies tax
    on tax.id = ap.art_id
  on ap.id = ekzaehleinheit.ap_id
  inner join apflora.tpopkontrzaehl_einheit_werte zaehl_einheit_werte
  on zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id
where
  ekzaehleinheit.zielrelevant = true
  and ekzaehleinheit.not_massn_count_unit = false
  and zaehl_einheit_werte.corresponds_to_massn_anz_triebe = false
  and zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = false
order by
  tax.artname,
  zaehl_einheit_werte.text;

-- add qk to apflora.qk
insert into apflora.qk (name, titel)
values ('ekzieleinheitOhneMassnZaehleinheit', 'Zielrelevante EK-Zähleinheit: Es wurde keine Massnahmen-Zähleinheit ("Anzahl Pflanzen", "Anzahl Triebe") zugeordnet und es wurde nicht markiert, dass diese Einheit bewusst keiner Massnahmen-Zähleinheit entsprechen soll');


-- ensure this qk is choosen:
insert into apflora.apqk (ap_id, qk_name)
select distinct
  id as ap_id,
  'ekzieleinheitOhneMassnZaehleinheit' as qk_name
from apflora.ap ap
inner join apflora.apqk qk
on ap.id = qk.ap_id
on conflict do nothing;

-- this qk schall sort as 5
update apflora.qk
set sort = sort + 1
where sort > 4;

update apflora.qk
set sort = 5
where name = 'ekzieleinheitOhneMassnZaehleinheit';