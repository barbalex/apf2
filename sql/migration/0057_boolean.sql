ALTER TABLE apflora.pop RENAME status_unklar TO status_unklar_old;
alter table apflora.pop ADD COLUMN status_unklar boolean default false;
UPDATE apflora.pop SET status_unklar = true where status_unklar_old = 1;
COMMENT ON COLUMN apflora.pop.status_unklar IS 'true = die Herkunft der Population ist unklar';
-- check data
alter table apflora.pop drop column status_unklar_old cascade;

ALTER TABLE apflora.tpop RENAME status_unklar TO status_unklar_old;
alter table apflora.tpop ADD COLUMN status_unklar boolean default false;
UPDATE apflora.tpop SET status_unklar = true where status_unklar_old = 1;
COMMENT ON COLUMN apflora.tpop.status_unklar IS 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)';
-- check data
alter table apflora.tpop drop column status_unklar_old cascade;

ALTER TABLE apflora.tpopkontr RENAME plan_vorhanden TO plan_vorhanden_old;
alter table apflora.tpopkontr ADD COLUMN plan_vorhanden boolean default false;
UPDATE apflora.tpopkontr SET plan_vorhanden = true where plan_vorhanden_old = 1;
COMMENT ON COLUMN apflora.tpopkontr.plan_vorhanden IS 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle';
-- check data
alter table apflora.tpopkontr drop column plan_vorhanden_old cascade;

ALTER TABLE apflora.tpopmassn RENAME plan_vorhanden TO plan_vorhanden_old;
alter table apflora.tpopmassn ADD COLUMN plan_vorhanden boolean default false;
UPDATE apflora.tpopmassn SET plan_vorhanden = true where plan_vorhanden_old = 1;
COMMENT ON COLUMN apflora.tpopmassn.plan_vorhanden IS 'Existiert ein Plan?';
-- check data
alter table apflora.tpopmassn drop column plan_vorhanden_old cascade;

ALTER TABLE apflora.tpopkontr RENAME jungpflanzen_vorhanden TO jungpflanzen_vorhanden_old;
alter table apflora.tpopkontr ADD COLUMN jungpflanzen_vorhanden boolean default false;
UPDATE apflora.tpopkontr SET jungpflanzen_vorhanden = true where jungpflanzen_vorhanden_old = 1;
COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_vorhanden IS 'Gibt es neben alten Pflanzen auch junge? Nur für Freiwilligen-Erfolgskontrolle';
-- check data
alter table apflora.tpopkontr drop column jungpflanzen_vorhanden_old cascade;

ALTER TABLE apflora.ae_eigenschaften RENAME kefart TO kefart_old;
alter table apflora.ae_eigenschaften ADD COLUMN kefart boolean default false;
UPDATE apflora.ae_eigenschaften SET kefart = true where kefart_old = -1;
-- check data
alter table apflora.ae_eigenschaften drop column kefart_old cascade;

-- add all views!
