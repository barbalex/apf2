-- 1. add new fields (done)
alter table apflora.tpopkontr add column apber_nicht_relevant boolean default null;
alter table apflora.tpopkontr add column apber_nicht_relevant_grund text DEFAULT NULL;
CREATE INDEX ON apflora.tpopkontr USING btree (apber_nicht_relevant);
COMMENT ON COLUMN apflora.tpopkontr.apber_nicht_relevant IS 'Pro Jahr sollte maximal eine Kontrolle AP-Bericht-relevant sein. Dient dazu Kontrollen auszuschliessen';
COMMENT ON COLUMN apflora.tpopkontr.apber_nicht_relevant_grund IS 'Grund, wieso die Kontrolle vom AP-Bericht ausgeschlossen wurde';

-- 2. Migrate ekf_verifiziert data to apber_nicht_relevant (done)
-- select * from apflora.tpopkontr where ekf_verifiziert = false;
update apflora.tpopkontr set apber_nicht_relevant = true where ekf_verifiziert = false;
-- select * from apflora.tpopkontr where apber_nicht_relevant = true;

-- 3. drop ekf_verifiziert fields (done)
alter table apflora.tpopkontr drop column ekf_verifiziert;
alter table apflora.tpopkontr drop column ekf_verifiziert_durch;
alter table apflora.tpopkontr drop column ekf_verifiziert_datum;
DROP INDEX if exists apflora.tpopkontr_ekf_verifiziert_idx;

-- 4. recreate all views (done)

-- 5. TODO: create unique index in zählungen
-- 5.1 find violating datasets
select * from apflora.tpopkontrzaehl ou
where (
  select count(*) from apflora.tpopkontrzaehl inr
  where
    inr.tpopkontr_id = ou.tpopkontr_id
    and inr.einheit = ou.einheit
) > 1

select 
  ae.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  kontr.id as kontr_id,
  kontr.jahr as kontr_jahr,
  kontr.datum as kontr_datum,
  ou.id,
  apflora.tpopkontrzaehl_einheit_werte.text as einheit,
  apflora.tpopkontrzaehl_methode_werte.text as methode,
  ou.anzahl,
  ou.changed,
  ou.changed_by
from apflora.tpopkontrzaehl ou
inner join apflora.tpopkontr kontr on kontr.id = ou.tpopkontr_id
inner join apflora.tpop tpop on tpop.id = kontr.tpop_id
inner join apflora.pop pop on pop.id = tpop.pop_id
inner join apflora.ap ap on ap.id = pop.ap_id
inner join apflora.ae_eigenschaften ae on ap.art_id = ae.id
LEFT JOIN apflora.tpopkontrzaehl_einheit_werte ON ou.einheit = apflora.tpopkontrzaehl_einheit_werte.code
LEFT JOIN apflora.tpopkontrzaehl_methode_werte ON ou.methode = apflora.tpopkontrzaehl_methode_werte.code
where (
  select count(*) from apflora.tpopkontrzaehl inr
  where
    inr.tpopkontr_id = ou.tpopkontr_id
    and inr.einheit = ou.einheit
) > 1
order by
  ae.artname,
  pop.nr,
  tpop.nr,
  kontr.jahr,
  kontr.datum;

-- 5.2 remove duplicates with smaller anzahl

select tpopkontr_id, einheit, anzahl from apflora.tpopkontrzaehl ou
where (
  select count(*) from apflora.tpopkontrzaehl inr
  where
    inr.tpopkontr_id = ou.tpopkontr_id
    and inr.einheit = ou.einheit
) > 1
order by tpopkontr_id, einheit, anzahl;

DELETE
FROM
  apflora.tpopkontrzaehl ou
  using apflora.tpopkontrzaehl b
WHERE
  (
    select count(*) from apflora.tpopkontrzaehl inr
    where
      inr.tpopkontr_id = ou.tpopkontr_id
      and inr.einheit = ou.einheit
  ) > 1
  and b.anzahl < ou.anzahl;


-- 5.2 create index
-- after conflicts are resolved, see https://github.com/barbalex/apf2/issues/273
CREATE unique INDEX tpopkontrzaehl_tpopkontrid_einheit_idx ON apflora.tpopkontrzaehl (tpopkontr_id, einheit);