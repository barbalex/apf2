drop table if exists apflora.ekzaehleinheit;
create table apflora.ekzaehleinheit(
  id uuid primary key default uuid_generate_v1mc(),
  ap_id uuid not null references apflora.ap (id) on delete cascade on update cascade,
  zaehleinheit_id uuid default null references apflora.tpopkontrzaehl_einheit_werte (id) on delete cascade on update cascade,
  zielrelevant boolean default false,
  sort smallint default null,
  bemerkungen text default null,
  changed date default now(),
  changed_by varchar(20) default null
);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (id);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (ap_id);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (zaehleinheit_id);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (sort);
COMMENT ON COLUMN apflora.ekzaehleinheit.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ekzaehleinheit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ekzaehleinheit.zaehleinheit_id IS 'Zugehörige Zähleinheit. Fremdschlüssel aus der Tabelle "tpopkontrzaehl_einheit_werte"';
COMMENT ON COLUMN apflora.ekzaehleinheit.bemerkungen IS 'Bemerkungen zur EK-Zähleinheit';
COMMENT ON COLUMN apflora.ekzaehleinheit.zielrelevant IS 'Ob die Zähleinheit zielrelevant ist';
COMMENT ON COLUMN apflora.ekzaehleinheit.sort IS 'Um die Zähleinheiten untereinander zu sortieren';
COMMENT ON COLUMN apflora.ekzaehleinheit.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ekzaehleinheit.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';
DROP POLICY IF EXISTS writer ON apflora.ekzaehleinheit;
CREATE POLICY writer ON apflora.ekzaehleinheit
  USING (true)
  WITH CHECK (
    current_user = 'apflora_manager'
    OR current_user = 'apflora_artverantwortlich'
  );
-- move data from ekfzaehleinheit to ekzaehleinheit
insert into apflora.ekzaehleinheit (id, ap_id, zaehleinheit_id, bemerkungen, changed, changed_by)
select id, ap_id, zaehleinheit_id, bemerkungen, changed, changed_by from apflora.ekfzaehleinheit;

drop function if exists apflora.ekzaehleinheit_label(ekzaehleinheit apflora.ekzaehleinheit);
create or replace function apflora.ekzaehleinheit_label(ekzaehleinheit apflora.ekzaehleinheit) returns text as $$
  select coalesce((select text from apflora.tpopkontrzaehl_einheit_werte where apflora.tpopkontrzaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id), '(keine zähleinheit gewählt)')
$$ language sql stable;
comment on function apflora.ekzaehleinheit_label(apflora.ekzaehleinheit) is e'@sortable';

DROP TRIGGER IF EXISTS ekzaehleinheit_max_3_per_ap ON apflora.ekzaehleinheit;
DROP FUNCTION IF EXISTS apflora.ekzaehleinheit_max_3_per_ap();
CREATE FUNCTION apflora.ekzaehleinheit_max_3_per_ap() RETURNS trigger AS $ekzaehleinheit_max_3_per_ap$
  DECLARE
    count integer;
  BEGIN
    -- check if 3 ekzaehleinheit already exists for this ap
    count := (SELECT count(*) FROM apflora.ekzaehleinheit WHERE ap_id = NEW.ap_id);
    IF count > 2 THEN
      RAISE EXCEPTION  'Pro Aktionsplan dürfen maximal drei EK-Zähleinheiten erfasst werden';
    END IF;
    RETURN NEW;
  END;
$ekzaehleinheit_max_3_per_ap$ LANGUAGE plpgsql;
CREATE TRIGGER ekzaehleinheit_max_3_per_ap BEFORE INSERT ON apflora.ekzaehleinheit
  FOR EACH ROW EXECUTE PROCEDURE apflora.ekzaehleinheit_max_3_per_ap();

-- change ui from ekfzaehleinheit to ekzaehleinheit (done)
drop table if exists apflora.ekfzaehleinheit cascade;
drop function if exists apflora.ekfzaehleinheit_label(ekfzaehleinheit apflora.ekfzaehleinheit);
DROP TRIGGER IF EXISTS ekfzaehleinheit_max_3_per_ap ON apflora.ekfzaehleinheit;
DROP FUNCTION IF EXISTS apflora.ekfzaehleinheit_max_3_per_ap();

drop table if exists apflora.ekfrequenz cascade;
create table apflora.ekfrequenz(
  id uuid primary key default uuid_generate_v1mc(),
  ap_id uuid not null references apflora.ap (id) on delete cascade on update cascade,
  ek boolean default false,
  ekf boolean default false,
  anwendungsfall text default null,
  code text default null unique,
  name text default null,
  periodizitaet text default null,
  kontrolljahre integer[],
  anzahl_min integer default null,
  anzahl_max integer default null,
  bemerkungen text default null,
  sort smallint default null,
  changed date default now(),
  changed_by varchar(20) default null
);
CREATE INDEX ON apflora.ekfrequenz USING btree (id);
CREATE INDEX ON apflora.ekfrequenz USING btree (ap_id);
CREATE INDEX ON apflora.ekfrequenz USING btree (ek);
CREATE INDEX ON apflora.ekfrequenz USING btree (ekf);
CREATE INDEX ON apflora.ekfrequenz USING btree (anwendungsfall);
CREATE INDEX ON apflora.ekfrequenz USING btree (code);
CREATE INDEX ON apflora.ekfrequenz USING btree (anzahl_min);
CREATE INDEX ON apflora.ekfrequenz USING btree (anzahl_max);
CREATE INDEX ON apflora.ekfrequenz USING btree (sort);
COMMENT ON COLUMN apflora.ekfrequenz.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ekfrequenz.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ekfrequenz.ek IS 'Diese Frequenz ist für EK anwendbar';
COMMENT ON COLUMN apflora.ekfrequenz.ekf IS 'Diese Frequenz ist für EKF anwendbar';
COMMENT ON COLUMN apflora.ekfrequenz.anwendungsfall IS 'Beschreibt, in welchen Fällen diese Frequenz angewandt wird. Wahrscheinliche Werte: autochthone Population, angepflanzte Population, angesäte Population, Spezialfall';
COMMENT ON COLUMN apflora.ekfrequenz.code IS 'Definierend für die eqfrequenz';
COMMENT ON COLUMN apflora.ekfrequenz.name IS 'Was genau?';
COMMENT ON COLUMN apflora.ekfrequenz.periodizitaet IS 'Beispielswerte: jedes 2. Jahr, nie';
COMMENT ON COLUMN apflora.ekfrequenz.kontrolljahre IS ' Definiert, in welchen Jahren eine Kontrolle üblicherweise stattfinden soll. Bei Anpflanzungen sind das Jahre ab der letzten Anpflanzung. Bei autochthonen Populationen?';
COMMENT ON COLUMN apflora.ekfrequenz.anzahl_min IS 'Ab dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant';
COMMENT ON COLUMN apflora.ekfrequenz.anzahl_max IS 'Bis zu dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant';
COMMENT ON COLUMN apflora.ekfrequenz.sort IS 'Damit EK-Zähleinheiten untereinander sortiert werden können';
COMMENT ON COLUMN apflora.ekfrequenz.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ekfrequenz.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';
DROP POLICY IF EXISTS writer ON apflora.ekfrequenz;
CREATE POLICY writer ON apflora.ekfrequenz
  USING (true)
  WITH CHECK (
    current_user = 'apflora_manager'
  );
-- insert some test data:
-- TODO: will this be the standard for every art?
insert into apflora.ekfrequenz (ap_id,ek,anwendungsfall,code,name,anzahl_min,anzahl_max,periodizitaet,sort) values 
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population autochthon','GA','stark gefährdet',1,20,'jedes 2. Jahr',1),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population autochthon','GB','mittel gefährdet',21,500,'jedes 4. Jahr',2),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population autochthon','GC','wenig gefährdet',501,100000,'jedes 8. Jahr',3),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population autochthon','GD','erloschen?',0,0,'nochmals Kontrolle im Folgejahr, ob erloschen',4),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population angepflanzt','NA','seit 1-2 Jahren angepflanzt',null,null,'im 2. Jahr',5),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population angepflanzt','NB','seit > 2 Jahren etabliert',null,null,'jedes 4. Jahr',6),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population angepflanzt','NC','seit > 6 Jahren etabliert',null,null,'jedes 8. Jahr',7),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population angepflanzt','ND','angesiedelt',0,0,'keine Kontrolle mehr',8),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Population angesät','A',null,0,0,'1. Kontrolle nach 4-6 Jahren. Falls etabliert: NB, NC',9),
('6c52d174-4f62-11e7-aebe-67a303eb0640',true,'Spezialfall','SA',null,0,0,'Keine Kontrollen',10);
-- TODO: build ui for ekfrequenz

DROP TABLE IF EXISTS apflora.ek_abrechnungstyp_werte;
CREATE TABLE apflora.ek_abrechnungstyp_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code text unique,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (id);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (code);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (sort);
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
insert into apflora.ek_abrechnungstyp_werte (code,text,sort) values
('a','a',1),
('b','b',2),
('c','c',3),
('d','d',4),
('e','e',5),
('f','f',6);
-- TODO: build ui for ek_abrechnungstyp_werte


ALTER TABLE apflora.tpop ADD COLUMN ekfrequenz text DEFAULT null REFERENCES apflora.ekfrequenz (code) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpop USING btree (ekfrequenz);
COMMENT ON COLUMN apflora.tpop.ekfrequenz IS 'Wert aus Tabelle ekfrequenz. Bestimmt, wie häufig kontrolliert werden soll';
ALTER TABLE apflora.tpop ADD COLUMN ekfrequenz_abweichend boolean DEFAULT false;
CREATE INDEX ON apflora.tpop USING btree (ekfrequenz_abweichend);
COMMENT ON COLUMN apflora.tpop.ekfrequenz_abweichend IS 'Diese Frequenz entspricht nicht derjenigen, welche gemäss Populationsgrösse vergeben worden wäre';
ALTER TABLE apflora.tpop ADD COLUMN ek_abrechnungstyp text DEFAULT null REFERENCES apflora.ek_abrechnungstyp_werte (code) ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX ON apflora.tpop USING btree (ek_abrechnungstyp);
COMMENT ON COLUMN apflora.tpop.ek_abrechnungstyp IS 'Fremdschlüssel aus Tabelle ek_abrechnungstyp_werte. Bestimmt, wie Kontrollen abgerechnet werden sollen';
-- TODO: add to tpop form

-- remove not any more needed
-- remove its ui elements (done)
alter table apflora.tpop drop column kontrollfrequenz cascade;
alter table apflora.tpop drop column kontrollfrequenz_freiwillige cascade;
DROP TABLE IF EXISTS apflora.tpopkontr_frequenz_werte cascade;
-- re-run all views

create type ek_type as enum ('ek', 'ekf');

DROP TABLE IF EXISTS apflora.ekplan;
CREATE TABLE apflora.ekplan (
  id uuid primary key default uuid_generate_v1mc(),
  tpop_id uuid default null references apflora.tpop (id) on delete cascade on update cascade,
  jahr smallint DEFAULT NULL,
  typ ek_type default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.ekplan USING btree (id);
CREATE INDEX ON apflora.ekplan USING btree (tpop_id);
CREATE INDEX ON apflora.ekplan USING btree (jahr);
CREATE INDEX ON apflora.ekplan USING btree (typ);
COMMENT ON COLUMN apflora.ekplan.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ekplan.tpop_id IS 'Fremdschlüssel aus der Tabelle tpop';
COMMENT ON COLUMN apflora.ekplan.jahr IS 'Jahr, in dem eine EK geplant ist';
COMMENT ON COLUMN apflora.ekplan.typ IS 'ek oder ekf';
COMMENT ON COLUMN apflora.ekplan.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ekplan.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE POLICY writer ON apflora.ekplan
  USING (true)
  WITH CHECK (
    current_user = 'apflora_manager'
    OR current_user = 'apflora_artverantwortlich'
  );
-- TODO: build form for ekplan
