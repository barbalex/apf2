-- 1. prepare new structure
alter table apflora.tpop rename column apber_relevant to apber_relevant_old;
alter table apflora.tpop add column apber_relevant boolean default null;
DROP TABLE IF EXISTS apflora.tpop_apberrelevant_grund_werte;
CREATE TABLE apflora.tpop_apberrelevant_grund_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code integer UNIQUE DEFAULT NULL,
  text text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (id);
CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (code);
CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (text);
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
alter table apflora.tpop add column apber_relevant_grund integer DEFAULT NULL REFERENCES apflora.tpop_apberrelevant_grund_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
COMMENT ON COLUMN apflora.tpop.apber_relevant_grund IS 'Grund für AP-Bericht Relevanz. Auswahl aus der Tabelle "tpop_apberrelevant_grund_werte"';

-- 2. migrate data
insert into apflora.tpop_apberrelevant_grund_werte(code, text, changed, changed_by)
values
  (2, 'historisch', '2010-03-27', 'KarinMarti'),
  (3, 'ausserkantonal', '2010-03-27', 'KarinMarti'),
  (5, 'kein Vorkommen', '2011-06-17', 'alex'),
  (6, 'anderer Grund', '2019-05-28', 'alex');
update apflora.tpop set apber_relevant = true where apber_relevant_old = 1;
update apflora.tpop set apber_relevant = false where apber_relevant_old > 1;
update apflora.tpop set apber_relevant_grund = apber_relevant_old where apber_relevant_old > 1;

-- 3. drop, then recreate all views
-- 4. drop, then recreate all functions

-- 5. clean up
alter table apflora.tpop drop column apber_relevant_old;
drop table apflora.tpop_apberrelevant_werte;