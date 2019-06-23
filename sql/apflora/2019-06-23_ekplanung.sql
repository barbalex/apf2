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
-- TODO:
-- move data from ekfzaehleinheit to ekzaehleinheit
insert into apflora.ekzaehleinheit (id, ap_id, zaehleinheit_id, bemerkungen, changed, changed_by)
select id, ap_id, zaehleinheit_id, bemerkungen, changed, changed_by from ekfzaehleinheit;
-- change ui from ekfzaehleinheit to ekzaehleinheit
-- drop table if exists apflora.ekfzaehleinheit;

drop table if exists apflora.ekfrequenz;
create table apflora.ekfrequenz(
  id uuid primary key default uuid_generate_v1mc(),
  ap_id uuid not null references apflora.ap (id) on delete cascade on update cascade,
  ek boolean default false,
  ekf boolean default false,
  anwendungsfall text default null,
  kuerzel text default null,
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
CREATE INDEX ON apflora.ekzaehleinheit USING btree (id);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (ap_id);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (ek);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (ekf);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (anwendungsfall);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (kuerzel);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (anzahl_min);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (anzahl_max);
CREATE INDEX ON apflora.ekzaehleinheit USING btree (sort);
COMMENT ON COLUMN apflora.ekzaehleinheit.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ekzaehleinheit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ekzaehleinheit.ek IS 'Diese Frequenz ist für EK anwendbar';
COMMENT ON COLUMN apflora.ekzaehleinheit.ekf IS 'Diese Frequenz ist für EKF anwendbar';
COMMENT ON COLUMN apflora.ekzaehleinheit.anwendungsfall IS 'Beschreibt, in welchen Fällen diese Frequenz angewandt wird. Wahrscheinliche Werte: autochthone Population, angepflanzte Population, angesäte Population, Spezialfall';
COMMENT ON COLUMN apflora.ekzaehleinheit.kuerzel IS 'Wird für den Import verwendet';
COMMENT ON COLUMN apflora.ekzaehleinheit.name IS 'Was genau?';
COMMENT ON COLUMN apflora.ekzaehleinheit.periodizitaet IS 'Beispielswerte: jedes 2. Jahr, nie';
COMMENT ON COLUMN apflora.ekzaehleinheit.kontrolljahre IS ' Definiert, in welchen Jahren eine Kontrolle üblicherweise stattfinden soll. Bei Anpflanzungen sind das Jahre ab der letzten Anpflanzung. Bei autochthonen Populationen?';
COMMENT ON COLUMN apflora.ekzaehleinheit.anzahl_min IS 'Ab dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant';
COMMENT ON COLUMN apflora.ekzaehleinheit.anzahl_max IS 'Bis zu dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant';
COMMENT ON COLUMN apflora.ekzaehleinheit.sort IS 'Damit EK-Zähleinheiten untereinander sortiert werden können';
COMMENT ON COLUMN apflora.ekzaehleinheit.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ekzaehleinheit.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';
DROP POLICY IF EXISTS writer ON apflora.ekfrequenz;
CREATE POLICY writer ON apflora.ekfrequenz
  USING (true)
  WITH CHECK (
    current_user = 'apflora_manager'
  );

DROP TABLE IF EXISTS apflora.abrechnungstyp_werte;
CREATE TABLE apflora.abrechnungstyp_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code text,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.abrechnungstyp_werte USING btree (id);
CREATE INDEX ON apflora.abrechnungstyp_werte USING btree (code);
CREATE INDEX ON apflora.abrechnungstyp_werte USING btree (sort);
COMMENT ON COLUMN apflora.abrechnungstyp_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

create type ek_type as enum ('ek', 'ekf');
DROP TABLE IF EXISTS apflora.ekplan;
CREATE TABLE apflora.ekplan (
  id uuid primary key default uuid_generate_v1mc(),
  tpopkontr_id uuid default null references apflora.tpopkontr (id) on delete cascade on update cascade,
  jahr smallint DEFAULT NULL,
  type ek_type default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.ekplan USING btree (id);
CREATE INDEX ON apflora.ekplan USING btree (tpopkontr_id);
CREATE INDEX ON apflora.ekplan USING btree (jahr);
CREATE INDEX ON apflora.ekplan USING btree (type);
COMMENT ON COLUMN apflora.abrechnungstyp_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.tpopkontr_id IS 'Fremdschlüssel aus der Tabelle tpopkontr';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.jahr IS 'Jahr, in dem eine EK geplant ist';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.type IS 'ek oder ekf';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.abrechnungstyp_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE POLICY writer ON apflora.ekplan
  USING (true)
  WITH CHECK (
    current_user = 'apflora_manager'
    OR current_user = 'apflora_artverantwortlich'
  );
