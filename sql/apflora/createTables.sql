-- this one first because of references to it
DROP TABLE IF EXISTS apflora.user CASCADE;
CREATE TABLE apflora.user (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  name text UNIQUE,
  -- allow other attributes to be null
  -- so names and roles can be set beforehand by topos
  email text UNIQUE default null,
  -- enforce role to prevent errors when no role is set
  role name not null DEFAULT 'apflora_ap_reader' check role_length_maximum_512 (length(role) < 512),
  pass text DEFAULT NULL check pass_length_minimum_6 (length(pass) > 5),
  adresse_id uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);
alter table apflora.user drop constraint if exists user_pass_check;
alter table apflora.user drop constraint if exists pass_length_minimum_6;
alter table apflora.user add constraint password_length_minimum_6 check (length(pass) > 5);
alter table apflora.user drop constraint if exists user_role_check;
alter table apflora.user add constraint role_length_maximum_512 check (length(role) < 512);
CREATE INDEX ON apflora.user USING btree (id);
CREATE INDEX ON apflora.user USING btree (name);
CREATE INDEX ON apflora.user USING btree (adresse_id);
comment on table apflora.user is 'Konten, um den Zugriff auf apflora.ch zu regeln';
COMMENT ON COLUMN apflora.user.adresse_id IS 'Datensatz bzw. Fremdschlüssel des Users in der Tabelle "adresse". Wird benutzt, damit die EKF-Kontrollen von Freiwilligen-Kontrolleurinnen gefiltert werden können';
alter table apflora.user add column adresse_id uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE;

create or replace function current_user_name() returns text as $$
  select nullif(current_setting('jwt.claims.username', true), '')::text;
$$ language sql stable security definer;

ALTER TABLE apflora.user ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reader_writer ON apflora.user;
CREATE POLICY reader_writer ON apflora.user
USING (
  name = current_user_name()
  OR current_user = 'anon'
  or current_user = 'apflora_manager'
);

DROP TABLE IF EXISTS adresse;
CREATE TABLE apflora.adresse (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  id SERIAL PRIMARY KEY,
  name text DEFAULT NULL,
  adresse text DEFAULT NULL,
  telefon text DEFAULT NULL,
  email text DEFAULT NULL,
  freiw_erfko boolean DEFAULT false,
  evab_nachname character varying(50) DEFAULT NULL,
  evab_vorname character varying(50) DEFAULT NULL,
  evab_ort character varying(50) DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.adresse USING btree (id);
CREATE INDEX ON apflora.adresse USING btree (name);
CREATE INDEX ON apflora.adresse USING btree (freiw_erfko);
CREATE INDEX ON apflora.adresse USING btree (user_id);
comment on table apflora.adresse is 'Adressen, die in anderen Tabellen zugeordent werden können. Nicht zu verwechseln mit Konten, welche den Zugriff auf apflora.ch ermöglichen (Tabelle apflora.user)';
COMMENT ON COLUMN apflora.adresse.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.adresse.name IS 'Vor- und Nachname';
COMMENT ON COLUMN apflora.adresse.adresse IS 'Strasse, PLZ und Ort';
COMMENT ON COLUMN apflora.adresse.telefon IS 'Telefonnummer';
COMMENT ON COLUMN apflora.adresse.email IS 'Email';
COMMENT ON COLUMN apflora.adresse.freiw_erfko IS 'Ist die Person freiwillige(r) Kontrolleur(in)';
COMMENT ON COLUMN apflora.adresse.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.adresse.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.adresse.evab_nachname IS 'Benötigt für den Export nach EvAB. Weil offenbar nicht immer alle Personen in EvAB enthalten sind, müssen sie jedesmal neu geschaffen werden :-(';
COMMENT ON COLUMN apflora.adresse.evab_vorname IS 'Benötigt für den Export nach EvAB. Weil offenbar nicht immer alle Personen in EvAB enthalten sind, müssen sie jedesmal neu geschaffen werden :-(';
COMMENT ON COLUMN apflora.adresse.evab_ort IS 'Benötigt für den Export nach EvAB. Weil offenbar nicht immer alle Personen in EvAB enthalten sind, müssen sie jedesmal neu geschaffen werden :-(';

ALTER TABLE apflora.adresse ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS writer ON apflora.adresse;
CREATE POLICY writer ON apflora.adresse
USING (true)
WITH CHECK (
  current_user in ('apflora_manager', 'apflora_ap_writer')
);

DROP TABLE IF EXISTS apflora.ap;
CREATE TABLE apflora.ap (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  art_id UUID UNIQUE DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) on delete no action on update cascade,
  proj_id uuid DEFAULT NULL REFERENCES apflora.projekt (id) ON DELETE CASCADE ON UPDATE CASCADE,
  bearbeitung integer DEFAULT NULL REFERENCES apflora.ap_bearbstand_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  start_jahr smallint DEFAULT NULL,
  umsetzung integer DEFAULT NULL REFERENCES apflora.ap_umsetzung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ekf_beobachtungszeitpunkt text default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.ap USING btree (id);
CREATE INDEX ON apflora.ap USING btree (art_id);
CREATE INDEX ON apflora.ap USING btree (proj_id);
CREATE INDEX ON apflora.ap USING btree (bearbeitung);
CREATE INDEX ON apflora.ap USING btree (start_jahr);
CREATE INDEX ON apflora.ap USING btree (umsetzung);
CREATE INDEX ON apflora.ap USING btree (bearbeiter);
COMMENT ON COLUMN apflora.ap.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap.proj_id IS 'Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj"';
COMMENT ON COLUMN apflora.ap.art_id IS 'Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert';
COMMENT ON COLUMN apflora.ap.bearbeitung IS 'In welchem Bearbeitungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap.start_jahr IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';
COMMENT ON COLUMN apflora.ap.umsetzung IS 'In welchem Umsetzungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap.bearbeiter IS 'Verantwortliche(r) für die Art';
COMMENT ON COLUMN apflora.ap.ekf_beobachtungszeitpunkt IS 'bester Beobachtungszeitpunkt';
COMMENT ON COLUMN apflora.ap.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ap enable row level security;
drop policy if exists reader on apflora.ap;
create policy reader on apflora.ap 
using (
  current_user in ('apflora_manager', 'apflora_reader', 'apflora_ap_writer', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


drop table if exists apflora.ap_user;
create table apflora.ap_user (
  id uuid primary key default uuid_generate_v1mc(),
  ap_id uuid default null references apflora.ap (id) on delete cascade on update cascade,
  user_name text default null references apflora.user (name) on delete cascade on update cascade,
  unique (ap_id, user_name)
);
CREATE INDEX ON apflora.ap_user USING btree (id);
CREATE INDEX ON apflora.ap_user USING btree (ap_id);
CREATE INDEX ON apflora.ap_user USING btree (user_name);
COMMENT ON table apflora.ap IS 'Hier wird bestimmt, welche Benutzer mit den rollen "apflora_ap_writer" oder "apflora_reader" Zugriff auf einen AP erhalten';

alter table apflora.ap_user enable row level security;
drop policy if exists reader on apflora.ap_user;
create policy reader on apflora.ap_user 
using (true)
with check (
  current_user = 'apflora_manager'
);


drop table if exists apflora.ap_file;
create table apflora.ap_file (
  id uuid primary key DEFAULT uuid_generate_v1mc(),
  ap_id uuid default null references apflora.ap (id) on delete cascade on update cascade,
  file_id uuid default null,
  file_mime_type text default null,
  name text default null,
  beschreibung text default null
);
create index on apflora.ap using btree (id);
create index on apflora.ap_file using btree (ap_id);
create index on apflora.ap_file using btree (file_id);
create index on apflora.ap_file using btree (file_mime_type);

alter table apflora.ap_file enable row level security;
drop policy if exists reader on apflora.ap_file;
create policy reader on apflora.ap_file 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


DROP TABLE IF EXISTS apflora.ap_history;
CREATE TABLE apflora.ap_history (
  year integer not null,
  id UUID not null,
  art_id UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) on delete no action on update cascade,
  proj_id uuid DEFAULT NULL REFERENCES apflora.projekt (id) ON DELETE CASCADE ON UPDATE CASCADE,
  bearbeitung integer DEFAULT NULL REFERENCES apflora.ap_bearbstand_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  start_jahr smallint DEFAULT NULL,
  umsetzung integer DEFAULT NULL REFERENCES apflora.ap_umsetzung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ekf_beobachtungszeitpunkt text default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null,
  primary key (id, year)
);
CREATE INDEX ON apflora.ap_history USING btree (id);
CREATE INDEX ON apflora.ap_history USING btree (year);
CREATE INDEX ON apflora.ap_history USING btree (art_id);
CREATE INDEX ON apflora.ap_history USING btree (proj_id);
CREATE INDEX ON apflora.ap_history USING btree (bearbeitung);
CREATE INDEX ON apflora.ap_history USING btree (start_jahr);
CREATE INDEX ON apflora.ap_history USING btree (umsetzung);
CREATE INDEX ON apflora.ap_history USING btree (bearbeiter);
COMMENT ON COLUMN apflora.ap_history.year IS 'Jahr: ap_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von ap kopiert';
COMMENT ON COLUMN apflora.ap_history.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_history.proj_id IS 'Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj"';
COMMENT ON COLUMN apflora.ap_history.art_id IS 'Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert';
COMMENT ON COLUMN apflora.ap_history.bearbeitung IS 'In welchem Bearbeitungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap_history.start_jahr IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';
COMMENT ON COLUMN apflora.ap_history.umsetzung IS 'In welchem Umsetzungsstand befindet sich der AP?';
COMMENT ON COLUMN apflora.ap_history.bearbeiter IS 'Verantwortliche(r) für die Art';
COMMENT ON COLUMN apflora.ap_history.ekf_beobachtungszeitpunkt IS 'bester Beobachtungszeitpunkt';
COMMENT ON COLUMN apflora.ap_history.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_history.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ap_history enable row level security;
drop policy if exists reader on apflora.ap_history;
create policy reader on apflora.ap_history 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);

-- this table is NOT YET IN USE
DROP TABLE IF EXISTS apflora.userprojekt;
CREATE TABLE apflora.userprojekt (
  username varchar(30) REFERENCES apflora.user (name) ON DELETE CASCADE ON UPDATE CASCADE,
  proj_id uuid REFERENCES apflora.projekt (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX ON apflora.userprojekt USING btree (username, proj_id);

DROP TABLE IF EXISTS apflora.ap_bearbstand_werte;
CREATE TABLE apflora.ap_bearbstand_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.ap_bearbstand_werte_code_seq owned by apflora.ap_bearbstand_werte.code;
alter table apflora.ap_bearbstand_werte alter column code set default nextval('apflora.ap_bearbstand_werte_code_seq');
select setval('apflora.ap_bearbstand_werte_code_seq', (select max(code)+1 from apflora.ap_bearbstand_werte), false);
alter table apflora.ap_bearbstand_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (id);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (code);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (sort);
CREATE INDEX ON apflora.ap_bearbstand_werte USING btree (historic);
COMMENT ON COLUMN apflora.ap_bearbstand_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_bearbstand_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.ap_bearbstand_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_bearbstand_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ap_bearbstand_werte enable row level security;
drop policy if exists reader on apflora.ap_bearbstand_werte;
create policy reader on apflora.ap_bearbstand_werte
using (true)
with check (
  current_user = 'apflora_manager'
);

-- this table is not used!!!
DROP TABLE IF EXISTS apflora.ap_erfbeurtkrit_werte;
CREATE TABLE apflora.ap_erfbeurtkrit_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);

create sequence apflora.ap_erfbeurtkrit_werte_code_seq owned by apflora.ap_erfbeurtkrit_werte.code;
alter table apflora.ap_erfbeurtkrit_werte alter column code set default nextval('apflora.ap_erfbeurtkrit_werte_code_seq');
select setval('apflora.ap_erfbeurtkrit_werte_code_seq', (select max(code)+1 from apflora.ap_erfbeurtkrit_werte), false);
alter table apflora.ap_erfbeurtkrit_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (id);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (code);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (sort);
CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree (historic);
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ap_erfbeurtkrit_werte enable row level security;
drop policy if exists reader on apflora.ap_erfbeurtkrit_werte;
create policy reader on apflora.ap_erfbeurtkrit_werte
using (true)
with check (
  current_user = 'apflora_manager'
);


DROP TABLE IF EXISTS apflora.ap_erfkrit_werte;
CREATE TABLE apflora.ap_erfkrit_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.ap_erfkrit_werte_code_seq owned by apflora.ap_erfkrit_werte.code;
alter table apflora.ap_erfkrit_werte alter column code set default nextval('apflora.ap_erfkrit_werte_code_seq');
select setval('apflora.ap_erfkrit_werte_code_seq', (select max(code)+1 from apflora.ap_erfkrit_werte), false);
alter table apflora.ap_erfkrit_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (id);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (code);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (sort);
CREATE INDEX ON apflora.ap_erfkrit_werte USING btree (historic);
COMMENT ON COLUMN apflora.ap_erfkrit_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.text IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_erfkrit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ap_erfkrit_werte enable row level security;
drop policy if exists reader on apflora.ap_erfkrit_werte;
create policy reader on apflora.ap_erfkrit_werte
using (true)
with check (
  current_user = 'apflora_manager'
);


DROP TABLE IF EXISTS apflora.ap_umsetzung_werte;
CREATE TABLE apflora.ap_umsetzung_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.ap_umsetzung_werte_code_seq owned by apflora.ap_umsetzung_werte.code;
alter table apflora.ap_umsetzung_werte alter column code set default nextval('apflora.ap_umsetzung_werte_code_seq');
select setval('apflora.ap_umsetzung_werte_code_seq', (select max(code)+1 from apflora.ap_umsetzung_werte), false);
alter table apflora.ap_umsetzung_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (id);
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (code);
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (sort);
CREATE INDEX ON apflora.ap_umsetzung_werte USING btree (historic);
COMMENT ON COLUMN apflora.ap_umsetzung_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ap_umsetzung_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.ap_umsetzung_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ap_umsetzung_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ap_umsetzung_werte enable row level security;
drop policy if exists reader on apflora.ap_umsetzung_werte;
create policy reader on apflora.ap_umsetzung_werte
using (true)
with check (
  current_user = 'apflora_manager'
);


DROP TABLE IF EXISTS apflora.apber;
CREATE TABLE apflora.apber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id UUID NOT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  situation text,
  vergleich_vorjahr_gesamtziel text,
  beurteilung integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  veraenderung_zum_vorjahr varchar(2) DEFAULT NULL,
  -- analyse is a reserved word!!!
  apber_analyse text DEFAULT NULL,
  konsequenzen_umsetzung text,
  konsequenzen_erfolgskontrolle text,
  biotope_neue text,
  biotope_optimieren text,
  massnahmen_optimieren text,
  massnahmen_ap_bearb text,
  massnahmen_planung_vs_ausfuehrung text,
  wirkung_auf_art text,
  datum date DEFAULT NULL,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.apber USING btree (id);
CREATE INDEX ON apflora.apber USING btree (ap_id);
CREATE INDEX ON apflora.apber USING btree (beurteilung);
CREATE INDEX ON apflora.apber USING btree (bearbeiter);
CREATE INDEX ON apflora.apber USING btree (jahr);
COMMENT ON COLUMN apflora.apber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.apber.situation IS 'Beschreibung der Situation im Berichtjahr. Seit 2017 nicht mehr verwendet: Früher wurden hier die Massnahmen aufgelistet';
COMMENT ON COLUMN apflora.apber.vergleich_vorjahr_gesamtziel IS 'Vergleich zu Vorjahr und Ausblick auf das Gesamtziel';
COMMENT ON COLUMN apflora.apber.beurteilung IS 'Beurteilung des Erfolgs des Aktionsplans bisher';
COMMENT ON COLUMN apflora.apber.veraenderung_zum_vorjahr IS 'Veränderung gegenüber dem Vorjahr: plus heisst aufgestiegen, minus heisst abgestiegen';
COMMENT ON COLUMN apflora.apber.apber_analyse IS 'Was sind die Ursachen fuer die beobachtete Entwicklung?';
COMMENT ON COLUMN apflora.apber.konsequenzen_umsetzung IS 'Konsequenzen für die Umsetzung';
COMMENT ON COLUMN apflora.apber.konsequenzen_erfolgskontrolle IS 'Konsequenzen für die Erfolgskontrolle';
COMMENT ON COLUMN apflora.apber.biotope_neue IS 'Bemerkungen zum Aussagebereich A: Grundmengen und getroffene Massnahmen';
COMMENT ON COLUMN apflora.apber.biotope_optimieren IS 'Bemerkungen zum Aussagebereich B: Bestandeskontrolle';
COMMENT ON COLUMN apflora.apber.massnahmen_optimieren IS 'Bemerkungen zum Aussagebereich C: Zwischenbilanz zur Wirkung von Massnahmen';
COMMENT ON COLUMN apflora.apber.massnahmen_ap_bearb IS 'Bemerkungen zum Aussagebereich C: Weitere Aktivitäten der Aktionsplan-Verantwortlichen';
COMMENT ON COLUMN apflora.apber.massnahmen_planung_vs_ausfuehrung IS 'Bemerkungen zum Aussagebereich C: Vergleich Ausführung/Planung';
COMMENT ON COLUMN apflora.apber.wirkung_auf_art IS 'Bemerkungen zum Aussagebereich D: Einschätzung der Wirkung des AP insgesamt pro Art';
COMMENT ON COLUMN apflora.apber.datum IS 'Datum der Nachführung';
COMMENT ON COLUMN apflora.apber.bearbeiter IS 'BerichtsverfasserIn: Auswahl aus der Tabelle "adresse"';
COMMENT ON COLUMN apflora.apber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
alter table apflora.apber alter column changed_by set default null;

alter table apflora.apber enable row level security;
drop policy if exists reader on apflora.apber;
create policy reader on apflora.apber 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


DROP TABLE IF EXISTS apflora.apberuebersicht;
CREATE TABLE apflora.apberuebersicht (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  proj_id uuid DEFAULT NULL REFERENCES apflora.projekt (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint,
  history_date date default null,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null,
  unique (proj_id, jahr)
);
CREATE INDEX ON apflora.apberuebersicht USING btree (id);
CREATE INDEX ON apflora.apberuebersicht USING btree (jahr);
CREATE INDEX ON apflora.apberuebersicht USING btree (proj_id);
COMMENT ON COLUMN apflora.apberuebersicht.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apberuebersicht.proj_id IS 'Zugehöriges Projekt. Zusammen mit jahr eindeutig';
COMMENT ON COLUMN apflora.apberuebersicht.jahr IS 'Berichtsjahr. Zusammen mit proj_id eindeutig';
COMMENT ON COLUMN apflora.apberuebersicht.history_date IS 'Datum, an dem die Daten von AP, Pop und TPop historisiert wurden';
COMMENT ON COLUMN apflora.apberuebersicht.bemerkungen IS 'Bemerkungen zur Artübersicht';
COMMENT ON COLUMN apflora.apberuebersicht.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apberuebersicht.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
alter table apflora.apberuebersicht alter column changed_by set default null;

alter table apflora.apberuebersicht enable row level security;
drop policy if exists reader on apflora.apberuebersicht;
create policy reader on apflora.apberuebersicht 
using  (
  current_user in ('apflora_manager', 'apflora_reader', 'apflora_ap_writer', 'apflora_ap_reader')
)
with check (
  current_user = 'apflora_manager'
);


DROP TABLE IF EXISTS apflora.assozart;
CREATE TABLE apflora.assozart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  ae_id UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies (id) ON DELETE no action ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.assozart USING btree (id);
CREATE INDEX ON apflora.assozart USING btree (ap_id);
CREATE INDEX ON apflora.assozart USING btree (ae_id);
COMMENT ON COLUMN apflora.assozart.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.assozart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.assozart.bemerkungen IS 'Bemerkungen zur Assoziation';
COMMENT ON COLUMN apflora.assozart.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.assozart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';
alter table apflora.assozart alter column changed_by set default null;

alter table apflora.assozart enable row level security;
drop policy if exists reader on apflora.assozart;
create policy reader on apflora.assozart 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


DROP TABLE IF EXISTS apflora.projekt;
CREATE TABLE apflora.projekt (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  name varchar(150) DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.projekt USING btree (id);
CREATE INDEX ON apflora.projekt USING btree (name);
COMMENT ON COLUMN apflora.projekt.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.projekt.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.projekt enable row level security;
drop policy if exists reader on apflora.projekt;
create policy reader on apflora.projekt 
using (true)
with check (
  current_user = 'apflora_manager'
);


DROP TABLE IF EXISTS apflora.erfkrit;
CREATE TABLE apflora.erfkrit (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id UUID NOT NULL DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  erfolg integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  kriterien text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.erfkrit USING btree (id);
CREATE INDEX ON apflora.erfkrit USING btree (ap_id);
CREATE INDEX ON apflora.erfkrit USING btree (erfolg);
COMMENT ON COLUMN apflora.erfkrit.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.erfkrit.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.erfkrit.erfolg IS 'Wie gut werden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfkrit_werte"';
COMMENT ON COLUMN apflora.erfkrit.kriterien IS 'Beschreibung der Kriterien für den Erfolg';
COMMENT ON COLUMN apflora.erfkrit.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.erfkrit.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.erfkrit enable row level security;
drop policy if exists reader on apflora.erfkrit;
create policy reader on apflora.erfkrit 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


DROP TABLE IF EXISTS apflora.idealbiotop;
CREATE TABLE apflora.idealbiotop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id UUID UNIQUE DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  erstelldatum date DEFAULT NULL,
  hoehenlage text,
  region text,
  exposition text,
  besonnung text,
  hangneigung text,
  boden_typ text,
  boden_kalkgehalt text,
  boden_durchlaessigkeit text,
  boden_humus text,
  boden_naehrstoffgehalt text,
  wasserhaushalt text,
  konkurrenz text,
  moosschicht text,
  krautschicht text,
  strauchschicht text,
  baumschicht text,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.idealbiotop USING btree (id);
CREATE INDEX ON apflora.idealbiotop USING btree (ap_id);
COMMENT ON COLUMN apflora.idealbiotop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.idealbiotop.ap_id IS 'Fremdschlüssel aus der Tabelle "ap (1:1-Beziehung)';
COMMENT ON COLUMN apflora.idealbiotop.erstelldatum IS 'Erstelldatum';
COMMENT ON COLUMN apflora.idealbiotop.hoehenlage IS 'Höhenlage';
COMMENT ON COLUMN apflora.idealbiotop.region IS 'Region';
COMMENT ON COLUMN apflora.idealbiotop.exposition IS 'Exposition';
COMMENT ON COLUMN apflora.idealbiotop.besonnung IS 'Besonnung';
COMMENT ON COLUMN apflora.idealbiotop.hangneigung IS 'Hangneigung';
COMMENT ON COLUMN apflora.idealbiotop.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.idealbiotop.boden_kalkgehalt IS 'Kalkgehalt im Boden';
COMMENT ON COLUMN apflora.idealbiotop.boden_durchlaessigkeit IS 'Bodendurchlässigkeit';
COMMENT ON COLUMN apflora.idealbiotop.boden_humus IS 'Bodenhumusgehalt';
COMMENT ON COLUMN apflora.idealbiotop.boden_naehrstoffgehalt IS 'Bodennährstoffgehalt';
COMMENT ON COLUMN apflora.idealbiotop.wasserhaushalt IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.idealbiotop.konkurrenz IS 'Konkurrenz';
COMMENT ON COLUMN apflora.idealbiotop.moosschicht IS 'Moosschicht';
COMMENT ON COLUMN apflora.idealbiotop.krautschicht IS 'Krautschicht';
COMMENT ON COLUMN apflora.idealbiotop.strauchschicht IS 'Strauchschicht';
COMMENT ON COLUMN apflora.idealbiotop.baumschicht IS 'Baumschicht';
COMMENT ON COLUMN apflora.idealbiotop.bemerkungen IS 'Bemerkungen';
COMMENT ON COLUMN apflora.idealbiotop.changed IS 'Wann wurde der Datensatz zuletzt verändert?';
COMMENT ON COLUMN apflora.idealbiotop.changed_by IS 'Wer hat den Datensatz zuletzt verändert?';

alter table apflora.idealbiotop enable row level security;
drop policy if exists reader on apflora.idealbiotop;
create policy reader on apflora.idealbiotop 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


drop table if exists apflora.idealbiotop_file;
create table apflora.idealbiotop_file (
  id uuid primary key DEFAULT uuid_generate_v1mc(),
  idealbiotop_id uuid default null references apflora.idealbiotop (id) on delete cascade on update cascade,
  file_id uuid default null,
  file_mime_type text default null,
  name text default null,
  beschreibung text default null
);
create index on apflora.idealbiotop using btree (id);
create index on apflora.idealbiotop_file using btree (idealbiotop_id);
create index on apflora.idealbiotop_file using btree (file_id);
create index on apflora.idealbiotop_file using btree (file_mime_type);

alter table apflora.idealbiotop_file enable row level security;
drop policy if exists reader on apflora.idealbiotop_file;
create policy reader on apflora.idealbiotop_file 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and id in (
      select apflora.idealbiotop_file.id
      from 
        apflora.idealbiotop_file
        inner join apflora.idealbiotop
        on apflora.idealbiotop.id = apflora.idealbiotop_file.idealbiotop_id
        where apflora.idealbiotop.ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and id in (
      select apflora.idealbiotop_file.id
      from 
        apflora.idealbiotop_file
        inner join apflora.idealbiotop
        on apflora.idealbiotop.id = apflora.idealbiotop_file.idealbiotop_id
        where apflora.idealbiotop.ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
    )
  )
);


DROP TABLE IF EXISTS apflora.pop;
CREATE TABLE apflora.pop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  nr integer DEFAULT NULL,
  name varchar(150) DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar boolean default false,
  status_unklar_begruendung text DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  geom_point geometry(Point, 4326) default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
create index on apflora.pop using gist (geom_point);
CREATE INDEX ON apflora.pop USING btree (id);
CREATE INDEX ON apflora.pop USING btree (ap_id);
CREATE INDEX ON apflora.pop USING btree (status);
CREATE INDEX ON apflora.pop USING btree (nr);
CREATE INDEX ON apflora.pop USING btree (name);
CREATE INDEX ON apflora.pop USING btree (bekannt_seit);
COMMENT ON COLUMN apflora.pop.id IS 'Primärschlüssel der Tabelle "pop"';
COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.pop.nr IS 'Nummer der Population';
COMMENT ON COLUMN apflora.pop.name IS 'Bezeichnung der Population';
COMMENT ON COLUMN apflora.pop.status IS 'Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.pop.status_unklar IS 'true = die Herkunft der Population ist unklar';
COMMENT ON COLUMN apflora.pop.status_unklar_begruendung IS 'Begründung, wieso die Herkunft unklar ist';
COMMENT ON COLUMN apflora.pop.bekannt_seit IS 'Seit wann ist die Population bekannt?';
COMMENT ON COLUMN apflora.pop.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.pop enable row level security;
drop policy if exists reader on apflora.pop;
create policy reader on apflora.pop 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


drop table if exists apflora.pop_file;
create table apflora.pop_file (
  id uuid primary key DEFAULT uuid_generate_v1mc(),
  pop_id uuid default null references apflora.pop (id) on delete cascade on update cascade,
  file_id uuid default null,
  file_mime_type text default null,
  name text default null,
  beschreibung text default null
);
create index on apflora.pop using btree (id);
create index on apflora.pop_file using btree (pop_id);
create index on apflora.pop_file using btree (file_id);
create index on apflora.pop_file using btree (file_mime_type);

alter table apflora.pop_file enable row level security;
drop policy if exists reader on apflora.pop_file;
create policy reader on apflora.pop_file 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and pop_id in (
      select id from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and pop_id in (
      select id from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.pop_history;
CREATE TABLE apflora.pop_history (
  year integer not null,
  id UUID not null,
  ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE NO ACTION on update cascade,
  nr integer DEFAULT NULL,
  name varchar(150) DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar boolean default false,
  status_unklar_begruendung text DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  geom_point geometry(Point, 4326) default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null,
  primary key (id, year)
);
CREATE INDEX ON apflora.pop_history USING btree (id);
CREATE INDEX ON apflora.pop_history USING btree (year);
CREATE INDEX ON apflora.pop_history USING btree (ap_id);
CREATE INDEX ON apflora.pop_history USING btree (status);
CREATE INDEX ON apflora.pop_history USING btree (nr);
CREATE INDEX ON apflora.pop_history USING btree (name);
CREATE INDEX ON apflora.pop_history USING btree (bekannt_seit);
COMMENT ON COLUMN apflora.pop_history.year IS 'Jahr: pop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von pop kopiert';
COMMENT ON COLUMN apflora.pop_history.id IS 'Primärschlüssel der Tabelle "pop"';

alter table apflora.pop_history enable row level security;
drop policy if exists reader on apflora.pop_history;
create policy reader on apflora.pop_history 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


DROP TABLE IF EXISTS apflora.pop_status_werte;
CREATE TABLE apflora.pop_status_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(60) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
create sequence apflora.pop_status_werte_code_seq owned by apflora.pop_status_werte.code;
alter table apflora.pop_status_werte alter column code set default nextval('apflora.pop_status_werte_code_seq');
select setval('apflora.pop_status_werte_code_seq', (select max(code)+1 from apflora.pop_status_werte), false);
alter table apflora.pop_status_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.pop_status_werte USING btree (id);
CREATE INDEX ON apflora.pop_status_werte USING btree (code);
CREATE INDEX ON apflora.pop_status_werte USING btree (text);
CREATE INDEX ON apflora.pop_status_werte USING btree (sort);
CREATE INDEX ON apflora.pop_status_werte USING btree (historic);
COMMENT ON COLUMN apflora.pop_status_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.pop_status_werte.text IS 'Beschreibung der Herkunft';
COMMENT ON COLUMN apflora.pop_status_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.pop_status_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.pop_status_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.pop_status_werte enable row level security;
drop policy if exists reader on apflora.pop_status_werte;
create policy reader on apflora.pop_status_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.popber;
CREATE TABLE apflora.popber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
COMMENT ON COLUMN apflora.popber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.popber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.popber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.popber USING btree (id);
CREATE INDEX ON apflora.popber USING btree (pop_id);
CREATE INDEX ON apflora.popber USING btree (entwicklung);
CREATE INDEX ON apflora.popber USING btree (jahr);

alter table apflora.popber enable row level security;
drop policy if exists reader on apflora.popber;
create policy reader on apflora.popber 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and pop_id in (
      select distinct apflora.pop.id 
      from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and pop_id in (
      select distinct apflora.pop.id 
      from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.popmassnber;
CREATE TABLE apflora.popmassnber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  beurteilung integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.popmassnber USING btree (id);
CREATE INDEX ON apflora.popmassnber USING btree (pop_id);
CREATE INDEX ON apflora.popmassnber USING btree (beurteilung);
CREATE INDEX ON apflora.popmassnber USING btree (jahr);
COMMENT ON COLUMN apflora.popmassnber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.popmassnber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.popmassnber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.popmassnber.beurteilung IS 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.popmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.popmassnber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.popmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.popmassnber enable row level security;
drop policy if exists reader on apflora.popmassnber;
create policy reader on apflora.popmassnber 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and pop_id in (
      select id 
      from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and pop_id in (
      select id 
      from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpop;
CREATE TABLE apflora.tpop (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  nr integer DEFAULT NULL,
  gemeinde text DEFAULT NULL,
  flurname text DEFAULT NULL,
  geom_point geometry(Point, 4326) default null,
  radius smallint DEFAULT NULL,
  hoehe smallint DEFAULT NULL,
  exposition varchar(50) DEFAULT NULL,
  klima varchar(50) DEFAULT NULL,
  neigung varchar(50) DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  kataster_nr text DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar boolean default false,
  status_unklar_grund text DEFAULT NULL,
  apber_relevant boolean default true,
  apber_relevant_grund integer DEFAULT NULL REFERENCES apflora.tpop_apberrelevant_grund_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bekannt_seit smallint DEFAULT NULL,
  eigentuemer text DEFAULT NULL,
  kontakt text DEFAULT NULL,
  nutzungszone text DEFAULT NULL,
  bewirtschafter text DEFAULT NULL,
  bewirtschaftung text DEFAULT NULL,
  ekfrequenz UUID DEFAULT null REFERENCES apflora.ekfrequenz (id) ON DELETE SET NULL ON UPDATE CASCADE,
  ekfrequenz_startjahr smallint default null,
  ekfrequenz_abweichend boolean DEFAULT false,
  ekf_kontrolleur uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
create index on apflora.tpop using gist (geom_point);
CREATE INDEX ON apflora.tpop USING btree (id);
CREATE INDEX ON apflora.tpop USING btree (pop_id);
CREATE INDEX ON apflora.tpop USING btree (status);
CREATE INDEX ON apflora.tpop USING btree (apber_relevant);
CREATE INDEX ON apflora.tpop USING btree (nr);
CREATE INDEX ON apflora.tpop USING btree (flurname);
CREATE INDEX ON apflora.tpop USING btree (ekfrequenz);
CREATE INDEX ON apflora.tpop USING btree (ekfrequenz_abweichend);
CREATE INDEX ON apflora.tpop USING btree (ekf_kontrolleur);
COMMENT ON COLUMN apflora.tpop.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';
COMMENT ON COLUMN apflora.tpop.nr IS 'Nummer der Teilpopulation';
COMMENT ON COLUMN apflora.tpop.gemeinde IS 'Gemeinde. Freier Text, Einträge aus apflora.gemeinde sollen gewählt werden können.';
COMMENT ON COLUMN apflora.tpop.flurname IS 'Flurname';
COMMENT ON COLUMN apflora.tpop.radius IS 'Radius der Teilpopulation (m)';
COMMENT ON COLUMN apflora.tpop.hoehe IS 'Höhe über Meer (m)';
COMMENT ON COLUMN apflora.tpop.exposition IS 'Exposition / Besonnung des Standorts';
COMMENT ON COLUMN apflora.tpop.klima IS 'Klima des Standorts';
COMMENT ON COLUMN apflora.tpop.neigung IS 'Hangneigung des Standorts';
COMMENT ON COLUMN apflora.tpop.beschreibung IS 'Beschreibung der Fläche';
COMMENT ON COLUMN apflora.tpop.kataster_nr IS 'Kataster-Nummer';
COMMENT ON COLUMN apflora.tpop.status IS 'Herkunft der Teilpopulation. Auswahl aus Tabelle "pop_status_werte"';
COMMENT ON COLUMN apflora.tpop.status_unklar IS 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)';
COMMENT ON COLUMN apflora.tpop.status_unklar_grund IS 'Wieso ist der Status unklar?';
COMMENT ON COLUMN apflora.tpop.apber_relevant_grund IS 'Grund für AP-Bericht Relevanz. Auswahl aus der Tabelle "tpop_apberrelevant_grund_werte"';
COMMENT ON COLUMN apflora.tpop.bekannt_seit IS 'Seit wann ist die Teilpopulation bekannt?';
COMMENT ON COLUMN apflora.tpop.eigentuemer IS 'EigentümerIn';
COMMENT ON COLUMN apflora.tpop.kontakt IS 'Kontaktperson vor Ort';
COMMENT ON COLUMN apflora.tpop.nutzungszone IS 'Nutzungszone';
COMMENT ON COLUMN apflora.tpop.bewirtschafter IS 'Wer bewirtschaftet die Fläche?';
COMMENT ON COLUMN apflora.tpop.bewirtschaftung IS 'Wie wird die Fläche bewirtschaftet?';
COMMENT ON COLUMN apflora.tpop.bemerkungen IS 'Bemerkungen zur Teilpopulation';
COMMENT ON COLUMN apflora.tpop.ekfrequenz IS 'Wert aus Tabelle ekfrequenz. Bestimmt, wie häufig kontrolliert werden soll';
comment on column apflora.tpop.ekfrequenz_startjahr is 'Das Basisjahr, von dem aus ekpläne gemäss eqfrequenz gesetzt werden';
COMMENT ON COLUMN apflora.tpop.ekfrequenz_abweichend IS 'Diese Frequenz entspricht nicht derjenigen, welche gemäss Populationsgrösse vergeben worden wäre';
COMMENT ON COLUMN apflora.tpop.ekfrequenz_abweichend IS 'Wer diese TPop freiwillig kontrolliert. Dient dazu, Formulare für die EKF zu generieren';
COMMENT ON COLUMN apflora.tpop.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop.changed IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpop enable row level security;
drop policy if exists reader on apflora.tpop;
create policy reader on apflora.tpop 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and pop_id in (
      select id 
      from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and pop_id in (
      select id 
      from apflora.pop
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


drop table if exists apflora.tpop_file;
create table apflora.tpop_file (
  id uuid primary key DEFAULT uuid_generate_v1mc(),
  tpop_id uuid default null references apflora.tpop (id) on delete cascade on update cascade,
  file_id uuid default null,
  file_mime_type text default null,
  name text default null,
  beschreibung text default null
);
create index on apflora.tpop using btree (id);
create index on apflora.tpop_file using btree (tpop_id);
create index on apflora.tpop_file using btree (file_id);
create index on apflora.tpop_file using btree (file_mime_type);

alter table apflora.tpop_file enable row level security;
drop policy if exists reader on apflora.tpop_file;
create policy reader on apflora.tpop_file 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpop_history;
CREATE TABLE apflora.tpop_history (
  year integer not null,
  id UUID not null,
  pop_id uuid DEFAULT NULL,
  nr integer DEFAULT NULL,
  gemeinde text DEFAULT NULL,
  flurname text DEFAULT NULL,
  geom_point geometry(Point, 4326) default null,
  radius smallint DEFAULT NULL,
  hoehe smallint DEFAULT NULL,
  exposition varchar(50) DEFAULT NULL,
  klima varchar(50) DEFAULT NULL,
  neigung varchar(50) DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  kataster_nr text DEFAULT NULL,
  status integer DEFAULT NULL,
  status_unklar boolean default false,
  status_unklar_grund text DEFAULT NULL,
  apber_relevant boolean default true,
  apber_relevant_grund integer DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  eigentuemer text DEFAULT NULL,
  kontakt text DEFAULT NULL,
  nutzungszone text DEFAULT NULL,
  bewirtschafter text DEFAULT NULL,
  bewirtschaftung text DEFAULT NULL,
  ekfrequenz UUID DEFAULT null,
  ekfrequenz_startjahr smallint default null,
  ekfrequenz_abweichend boolean DEFAULT false,
  ekf_kontrolleur uuid DEFAULT NULL,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null,
  primary key (id, year)
);
alter table apflora.tpop_history add constraint fk_pop_history FOREIGN key (year, pop_id) references apflora.pop_history (year, id) ON DELETE NO ACTION ON UPDATE NO ACTION;
comment on table apflora.tpop_history is E'@foreignKey (pop_id) references pop (id)\n@foreignKey (status) references pop_status_werte (code)\n@foreignKey (apber_relevant_grund) references tpop_apberrelevant_grund_werte (code)\n@foreignKey (ekfrequenz) references ekfrequenz (id)\n@foreignKey (ekf_kontrolleur) references adresse (id)';
CREATE INDEX ON apflora.tpop_history USING btree (id);
CREATE INDEX ON apflora.tpop_history USING btree (year);
CREATE INDEX ON apflora.tpop_history USING btree (pop_id);
CREATE INDEX ON apflora.tpop_history USING btree (status);
CREATE INDEX ON apflora.tpop_history USING btree (apber_relevant);
CREATE INDEX ON apflora.tpop_history USING btree (nr);
CREATE INDEX ON apflora.tpop_history USING btree (flurname);
CREATE INDEX ON apflora.tpop_history USING btree (ekf_kontrolleur);
CREATE INDEX ON apflora.tpop_history USING btree (ekfrequenz);
CREATE INDEX ON apflora.tpop_history USING btree (apber_relevant_grund);
COMMENT ON COLUMN apflora.tpop_history.year IS 'Jahr: tpop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von tpop kopiert';
COMMENT ON COLUMN apflora.tpop_history.id IS 'Primärschlüssel der Tabelle tpop';

alter table apflora.tpop_history enable row level security;
drop policy if exists reader on apflora.tpop_history;
create policy reader on apflora.tpop_history 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and pop_id in (
      select id 
      from apflora.pop_history
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and pop_id in (
      select id 
      from apflora.pop_history
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpop_apberrelevant_grund_werte;
CREATE TABLE apflora.tpop_apberrelevant_grund_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text text,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpop_apberrelevant_grund_werte_code_seq owned by apflora.tpop_apberrelevant_grund_werte.code;
alter table apflora.tpop_apberrelevant_grund_werte alter column code set default nextval('apflora.tpop_apberrelevant_grund_werte_code_seq');
select setval('apflora.tpop_apberrelevant_grund_werte_code_seq', (select max(code)+1 from apflora.tpop_apberrelevant_grund_werte), false);
alter table apflora.tpop_apberrelevant_grund_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (id);
CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (code);
CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (text);
CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpop_apberrelevant_grund_werte enable row level security;
drop policy if exists reader on apflora.tpop_apberrelevant_grund_werte;
create policy reader on apflora.tpop_apberrelevant_grund_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpop_entwicklung_werte;
CREATE TABLE apflora.tpop_entwicklung_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpop_entwicklung_werte_code_seq owned by apflora.tpop_entwicklung_werte.code;
alter table apflora.tpop_entwicklung_werte alter column code set default nextval('apflora.tpop_entwicklung_werte_code_seq');
select setval('apflora.tpop_entwicklung_werte_code_seq', (select max(code)+1 from apflora.tpop_entwicklung_werte), false);
alter table apflora.tpop_entwicklung_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (id);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (code);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (sort);
CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpop_entwicklung_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpop_entwicklung_werte enable row level security;
drop policy if exists reader on apflora.tpop_entwicklung_werte;
create policy reader on apflora.tpop_entwicklung_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopber;
CREATE TABLE apflora.tpopber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
COMMENT ON COLUMN apflora.tpopber.id IS 'Primärschlüssel der Tabelle "tpopber"';
COMMENT ON COLUMN apflora.tpopber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.tpopber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopber USING btree (id);
CREATE INDEX ON apflora.tpopber USING btree (tpop_id);
CREATE INDEX ON apflora.tpopber USING btree (entwicklung);
CREATE INDEX ON apflora.tpopber USING btree (jahr);

alter table apflora.tpopber enable row level security;
drop policy if exists reader on apflora.tpopber;
create policy reader on apflora.tpopber 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpopkontr;
CREATE TABLE apflora.tpopkontr (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ varchar(50) DEFAULT NULL REFERENCES apflora.tpopkontr_typ_werte (text) ON DELETE SET NULL ON UPDATE CASCADE,
  datum date DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  vitalitaet text DEFAULT NULL,
  ueberlebensrate smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  ursachen text DEFAULT NULL,
  erfolgsbeurteilung text DEFAULT NULL,
  umsetzung_aendern text DEFAULT NULL,
  kontrolle_aendern text DEFAULT NULL,
  bemerkungen text,
  lr_delarze text DEFAULT NULL,
  flaeche integer DEFAULT NULL,
  lr_umgebung_delarze text DEFAULT NULL,
  vegetationstyp varchar(100) DEFAULT NULL,
  konkurrenz varchar(100) DEFAULT NULL,
  moosschicht varchar(100) DEFAULT NULL,
  krautschicht varchar(100) DEFAULT NULL,
  strauchschicht text DEFAULT NULL,
  baumschicht varchar(100) DEFAULT NULL,
  boden_typ text DEFAULT NULL,
  boden_kalkgehalt varchar(100) DEFAULT NULL,
  boden_durchlaessigkeit varchar(100) DEFAULT NULL,
  boden_humus varchar(100) DEFAULT NULL,
  boden_naehrstoffgehalt varchar(100) DEFAULT NULL,
  boden_abtrag text DEFAULT NULL,
  wasserhaushalt text DEFAULT NULL,
  idealbiotop_uebereinstimmung integer DEFAULT NULL REFERENCES apflora.tpopkontr_idbiotuebereinst_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  handlungsbedarf text,
  flaeche_ueberprueft integer DEFAULT NULL,
  plan_vorhanden boolean DEFAULT false,
  deckung_vegetation smallint DEFAULT NULL,
  deckung_nackter_boden smallint DEFAULT NULL,
  deckung_ap_art smallint DEFAULT NULL,
  jungpflanzen_vorhanden boolean DEFAULT null,
  vegetationshoehe_maximum smallint DEFAULT NULL,
  vegetationshoehe_mittel smallint DEFAULT NULL,
  gefaehrdung text DEFAULT NULL,
  apber_nicht_relevant boolean default null,
  apber_nicht_relevant_grund text DEFAULT NULL,
  ekf_bemerkungen text DEFAULT NULL,
  zeit_id UUID DEFAULT uuid_generate_v1mc(),
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.tpopkontr USING btree (id);
CREATE INDEX ON apflora.tpopkontr USING btree (tpop_id);
CREATE INDEX ON apflora.tpopkontr USING btree (bearbeiter);
CREATE INDEX ON apflora.tpopkontr USING btree (entwicklung);
CREATE INDEX ON apflora.tpopkontr USING btree (idealbiotop_uebereinstimmung);
CREATE INDEX ON apflora.tpopkontr USING btree (jahr);
CREATE INDEX ON apflora.tpopkontr USING btree (typ);
CREATE INDEX ON apflora.tpopkontr USING btree (datum);
CREATE INDEX ON apflora.tpopkontr USING btree (apber_nicht_relevant);
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree (zeit_id);
COMMENT ON COLUMN apflora.tpopkontr.id IS 'Primärschlüssel. Wird u.a. verwendet für die Identifikation der Beobachtung im nationalen Beobachtungs-Daten-Kreislauf';
COMMENT ON COLUMN apflora.tpopkontr.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopkontr.typ IS 'Typ der Kontrolle. Auswahl aus Tabelle "tpopkontr_typ_werte"';
COMMENT ON COLUMN apflora.tpopkontr.datum IS 'Wann wurde kontrolliert?';
COMMENT ON COLUMN apflora.tpopkontr.jahr IS 'In welchem Jahr wurde kontrolliert? Für welches Jahr gilt die Beschreibung?';
COMMENT ON COLUMN apflora.tpopkontr.bearbeiter IS 'Wer hat kontrolliert? Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopkontr.vitalitaet IS 'Vitalität der Pflanzen';
COMMENT ON COLUMN apflora.tpopkontr.ueberlebensrate IS 'Überlebensrate in Prozent';
COMMENT ON COLUMN apflora.tpopkontr.entwicklung IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "tpop_entwicklung_werte"';
COMMENT ON COLUMN apflora.tpopkontr.ursachen IS 'Ursachen der Entwicklung';
COMMENT ON COLUMN apflora.tpopkontr.erfolgsbeurteilung IS 'Erfolgsbeurteilung';
COMMENT ON COLUMN apflora.tpopkontr.umsetzung_aendern IS 'Vorschlag für Änderung der Umsetzung';
COMMENT ON COLUMN apflora.tpopkontr.kontrolle_aendern IS 'Vorschlag für Änderung der Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.bemerkungen IS 'Bemerkungen zur Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.lr_delarze IS 'Lebensraumtyp nach Delarze';
COMMENT ON COLUMN apflora.tpopkontr.flaeche IS 'Fläche der Teilpopulation';
COMMENT ON COLUMN apflora.tpopkontr.lr_umgebung_delarze IS 'Lebensraumtyp der direkt angrenzenden Umgebung (nach Delarze)';
COMMENT ON COLUMN apflora.tpopkontr.vegetationstyp IS 'Vegetationstyp';
COMMENT ON COLUMN apflora.tpopkontr.konkurrenz IS 'Konkurrenz';
COMMENT ON COLUMN apflora.tpopkontr.moosschicht IS 'Moosschicht';
COMMENT ON COLUMN apflora.tpopkontr.krautschicht IS 'Krautschicht';
COMMENT ON COLUMN apflora.tpopkontr.strauchschicht IS 'Strauchschicht, ehemals Verbuschung (%)';
COMMENT ON COLUMN apflora.tpopkontr.baumschicht IS 'Baumschicht';
COMMENT ON COLUMN apflora.tpopkontr.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.tpopkontr.boden_kalkgehalt IS 'Kalkgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_durchlaessigkeit IS 'Durchlässigkeit des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_humus IS 'Humusgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_naehrstoffgehalt IS 'Nährstoffgehalt des Bodens';
COMMENT ON COLUMN apflora.tpopkontr.boden_abtrag IS 'Oberbodenabtrag';
COMMENT ON COLUMN apflora.tpopkontr.wasserhaushalt IS 'Wasserhaushalt';
COMMENT ON COLUMN apflora.tpopkontr.idealbiotop_uebereinstimmung IS 'Übereinstimmung mit dem Idealbiotop';
COMMENT ON COLUMN apflora.tpopkontr.handlungsbedarf IS 'Handlungsbedarf bezüglich Biotop';
COMMENT ON COLUMN apflora.tpopkontr.flaeche_ueberprueft IS 'Überprüfte Fläche in m2. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.plan_vorhanden IS 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.deckung_vegetation IS 'Von Pflanzen, Streu oder Moos bedeckter Boden (%). Nur für Freiwilligen-Erfolgskontrolle. Nur bis 2012 erfasst.';
COMMENT ON COLUMN apflora.tpopkontr.deckung_nackter_boden IS 'Flächenanteil nackter Boden (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.deckung_ap_art IS 'Flächenanteil der überprüften Pflanzenart (%). Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_vorhanden IS 'Gibt es neben alten Pflanzen auch junge? EK & EKF';
COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_maximum IS 'Maximale Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_mittel IS 'Mittlere Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.gefaehrdung IS 'Gefährdung. Nur für Freiwilligen-Erfolgskontrolle';
COMMENT ON COLUMN apflora.tpopkontr.zeit_id IS 'GUID für den Export von Zeiten in EvAB';
COMMENT ON COLUMN apflora.tpopkontr.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr.apber_nicht_relevant IS 'Pro Jahr sollte maximal eine Kontrolle AP-Bericht-relevant sein. Dient dazu Kontrollen auszuschliessen';
COMMENT ON COLUMN apflora.tpopkontr.apber_nicht_relevant_grund IS 'Grund, wieso die Kontrolle vom AP-Bericht ausgeschlossen wurde';

alter table apflora.tpopkontr enable row level security;
drop policy if exists reader on apflora.tpopkontr;
create policy reader on apflora.tpopkontr 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
);


drop table if exists apflora.tpopkontr_file;
create table apflora.tpopkontr_file (
  id uuid primary key DEFAULT uuid_generate_v1mc(),
  tpopkontr_id uuid default null references apflora.tpopkontr (id) on delete cascade on update cascade,
  file_id uuid default null,
  file_mime_type text default null,
  name text default null,
  beschreibung text default null
);
create index on apflora.tpopkontr using btree (id);
create index on apflora.tpopkontr_file using btree (tpopkontr_id);
create index on apflora.tpopkontr_file using btree (file_id);
create index on apflora.tpopkontr_file using btree (file_mime_type);

alter table apflora.tpopkontr_file enable row level security;
drop policy if exists reader on apflora.tpopkontr_file;
create policy reader on apflora.tpopkontr_file 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpopkontr_id in (
      select id
      from apflora.tpopkontr
      where tpop_id in (
        select id
        from apflora.tpop
        where pop_id in (
          select id 
          from apflora.pop
          where ap_id in (
            select ap_id from apflora.ap_user where user_name = current_user_name()
          )
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpopkontr_id in (
      select id
      from apflora.tpopkontr
      where tpop_id in (
        select id
        from apflora.tpop
        where pop_id in (
          select id 
          from apflora.pop
          where ap_id in (
            select ap_id from apflora.ap_user where user_name = current_user_name()
          )
        )
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpopkontr_idbiotuebereinst_werte;
CREATE TABLE apflora.tpopkontr_idbiotuebereinst_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpopkontr_idbiotuebereinst_werte_code_seq owned by apflora.tpopkontr_idbiotuebereinst_werte.code;
alter table apflora.tpopkontr_idbiotuebereinst_werte alter column code set default nextval('apflora.tpopkontr_idbiotuebereinst_werte_code_seq');
select setval('apflora.tpopkontr_idbiotuebereinst_werte_code_seq', (select max(code)+1 from apflora.tpopkontr_idbiotuebereinst_werte), false);
alter table apflora.tpopkontr_idbiotuebereinst_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (sort);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopkontr_idbiotuebereinst_werte enable row level security;
drop policy if exists reader on apflora.tpopkontr_idbiotuebereinst_werte;
create policy reader on apflora.tpopkontr_idbiotuebereinst_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopkontr_typ_werte;
CREATE TABLE apflora.tpopkontr_typ_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) unique DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpopkontr_typ_werte_code_seq owned by apflora.tpopkontr_typ_werte.code;
alter table apflora.tpopkontr_typ_werte alter column code set default nextval('apflora.tpopkontr_typ_werte_code_seq');
select setval('apflora.tpopkontr_typ_werte_code_seq', (select max(code)+1 from apflora.tpopkontr_typ_werte), false);
alter table apflora.tpopkontr_typ_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree (sort);
CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpopkontr_typ_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontr_typ_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpopkontr_typ_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontr_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopkontr_typ_werte enable row level security;
drop policy if exists reader on apflora.tpopkontr_typ_werte;
create policy reader on apflora.tpopkontr_typ_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopkontrzaehl;
CREATE TABLE apflora.tpopkontrzaehl (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  tpopkontr_id uuid DEFAULT NULL REFERENCES apflora.tpopkontr (id) ON DELETE CASCADE ON UPDATE CASCADE,
  anzahl integer DEFAULT NULL,
  einheit integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  methode integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_methode_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null,
  unique (id, einheit)
);
-- 2019 10 29: alter table apflora.tpopkontrzaehl add constraint id_einheit_unique unique (id, einheit);
COMMENT ON COLUMN apflora.tpopkontrzaehl.anzahl IS 'Anzahl Zaehleinheiten';
COMMENT ON COLUMN apflora.tpopkontrzaehl.einheit IS 'Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte"';
COMMENT ON COLUMN apflora.tpopkontrzaehl.methode IS 'Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte"';
COMMENT ON COLUMN apflora.tpopkontrzaehl.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (id);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (tpopkontr_id);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (anzahl);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (einheit);
CREATE INDEX ON apflora.tpopkontrzaehl USING btree (methode);

alter table apflora.tpopkontrzaehl enable row level security;
drop policy if exists reader on apflora.tpopkontrzaehl;
create policy reader on apflora.tpopkontrzaehl 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpopkontr_id in (
      select id
      from apflora.tpopkontr
      where tpop_id in (
        select id
        from apflora.tpop
        where pop_id in (
          select id 
          from apflora.pop
          where ap_id in (
            select ap_id from apflora.ap_user where user_name = current_user_name()
          )
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpopkontr_id in (
      select id
      from apflora.tpopkontr
      where tpop_id in (
        select id
        from apflora.tpop
        where pop_id in (
          select id 
          from apflora.pop
          where ap_id in (
            select ap_id from apflora.ap_user where user_name = current_user_name()
          )
        )
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpopkontrzaehl_einheit_werte;
CREATE TABLE apflora.tpopkontrzaehl_einheit_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpopkontrzaehl_einheit_werte_code_seq owned by apflora.tpopkontrzaehl_einheit_werte.code;
alter table apflora.tpopkontrzaehl_einheit_werte alter column code set default nextval('apflora.tpopkontrzaehl_einheit_werte_code_seq');
select setval('apflora.tpopkontrzaehl_einheit_werte_code_seq', (select max(code)+1 from apflora.tpopkontrzaehl_einheit_werte), false);
alter table apflora.tpopkontrzaehl_einheit_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (sort);
CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopkontrzaehl_einheit_werte enable row level security;
drop policy if exists reader on apflora.tpopkontrzaehl_einheit_werte;
create policy reader on apflora.tpopkontrzaehl_einheit_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopkontrzaehl_methode_werte;
CREATE TABLE apflora.tpopkontrzaehl_methode_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpopkontrzaehl_methode_werte_code_seq owned by apflora.tpopkontrzaehl_methode_werte.code;
alter table apflora.tpopkontrzaehl_methode_werte alter column code set default nextval('apflora.tpopkontrzaehl_methode_werte_code_seq');
select setval('apflora.tpopkontrzaehl_methode_werte_code_seq', (select max(code)+1 from apflora.tpopkontrzaehl_methode_werte), false);
alter table apflora.tpopkontrzaehl_methode_werte alter column changed_by drop not null, alter column changed_by set default null;

alter table apflora.tpopkontrzaehl_methode_werte alter column changed_by set default null;
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (sort);
CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopkontrzaehl_methode_werte enable row level security;
drop policy if exists reader on apflora.tpopkontrzaehl_methode_werte;
create policy reader on apflora.tpopkontrzaehl_methode_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopmassn;
CREATE TABLE apflora.tpopmassn (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ integer DEFAULT NULL REFERENCES apflora.tpopmassn_typ_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  beschreibung text DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  datum date DEFAULT NULL,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse (id) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  plan_vorhanden boolean DEFAULT false,
  plan_bezeichnung text DEFAULT NULL,
  flaeche integer DEFAULT NULL,
  markierung text DEFAULT NULL,
  anz_triebe integer DEFAULT NULL,
  anz_pflanzen integer DEFAULT NULL,
  anz_pflanzstellen integer DEFAULT NULL,
  zieleinheit_einheit integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  zieleinheit_anzahl integer DEFAULT NULL,
  wirtspflanze text DEFAULT NULL,
  herkunft_pop text DEFAULT NULL,
  sammeldatum varchar(50) DEFAULT NULL,
  von_anzahl_individuen integer default null,
  form text DEFAULT NULL,
  pflanzanordnung text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE UNIQUE INDEX ON apflora.tpopmassn USING btree (id);
CREATE INDEX ON apflora.tpopmassn USING btree (tpop_id);
CREATE INDEX ON apflora.tpopmassn USING btree (bearbeiter);
CREATE INDEX ON apflora.tpopmassn USING btree (typ);
CREATE INDEX ON apflora.tpopmassn USING btree (jahr);
COMMENT ON COLUMN apflora.tpopmassn.id IS 'Primärschlüssel der Tabelle "tpopmassn"';
COMMENT ON COLUMN apflora.tpopmassn.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopmassn.typ IS 'Typ der Massnahme. Auswahl aus Tabelle "tpopmassn_typ_werte"';
COMMENT ON COLUMN apflora.tpopmassn.beschreibung IS 'Was wurde gemacht? V.a. für Typ "Spezial"';
COMMENT ON COLUMN apflora.tpopmassn.jahr IS 'Jahr, in dem die Massnahme durchgeführt wurde';
COMMENT ON COLUMN apflora.tpopmassn.datum IS 'Datum, an dem die Massnahme durchgeführt wurde';
COMMENT ON COLUMN apflora.tpopmassn.bearbeiter IS 'Verantwortliche BearbeiterIn. Auswahl aus Tabelle "adresse"';
COMMENT ON COLUMN apflora.tpopmassn.bemerkungen IS 'Bemerkungen zur Massnahme';
COMMENT ON COLUMN apflora.tpopmassn.plan_vorhanden IS 'Existiert ein Plan?';
COMMENT ON COLUMN apflora.tpopmassn.plan_bezeichnung IS 'Bezeichnung auf dem Plan';
COMMENT ON COLUMN apflora.tpopmassn.flaeche IS 'Fläche der Massnahme bzw. Teilpopulation (m2)';
COMMENT ON COLUMN apflora.tpopmassn.markierung IS 'Markierung der Massnahme bzw. Teilpopulation';
COMMENT ON COLUMN apflora.tpopmassn.anz_triebe IS 'Anzahl angesiedelte Triebe';
COMMENT ON COLUMN apflora.tpopmassn.anz_pflanzen IS 'Anzahl angesiedelte Pflanzen';
COMMENT ON COLUMN apflora.tpopmassn.anz_pflanzstellen IS 'Anzahl Töpfe/Pflanzstellen';
COMMENT ON COLUMN apflora.tpopmassn.zieleinheit_einheit IS 'Gezählte Zieleinheit';
COMMENT ON COLUMN apflora.tpopmassn.zieleinheit_anzahl IS 'Anzahl Zieleinheiten';
COMMENT ON COLUMN apflora.tpopmassn.wirtspflanze IS 'Wirtspflanze';
COMMENT ON COLUMN apflora.tpopmassn.herkunft_pop IS 'Aus welcher Population stammt das Pflanzenmaterial?';
COMMENT ON COLUMN apflora.tpopmassn.sammeldatum IS 'Datum, an dem die angesiedelten Pflanzen gesammelt wurden';
COMMENT ON COLUMN apflora.tpopmassn.von_anzahl_individuen IS 'Anzahl besammelte Individuen der Herkunftspopulation';
COMMENT ON COLUMN apflora.tpopmassn.form IS 'Form, Grösse der Ansiedlung';
COMMENT ON COLUMN apflora.tpopmassn.pflanzanordnung IS 'Anordnung der Pflanzung';
COMMENT ON COLUMN apflora.tpopmassn.id IS 'GUID der Tabelle "tpopmassn"';
COMMENT ON COLUMN apflora.tpopmassn.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopmassn enable row level security;
drop policy if exists reader on apflora.tpopmassn;
create policy reader on apflora.tpopmassn 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
);


drop table if exists apflora.tpopmassn_file;
create table apflora.tpopmassn_file (
  id uuid primary key DEFAULT uuid_generate_v1mc(),
  tpopmassn_id uuid default null references apflora.tpopmassn (id) on delete cascade on update cascade,
  file_id uuid default null,
  file_mime_type text default null,
  name text default null,
  beschreibung text default null
);
create index on apflora.tpopmassn using btree (id);
create index on apflora.tpopmassn_file using btree (tpopmassn_id);
create index on apflora.tpopmassn_file using btree (file_id);
create index on apflora.tpopmassn_file using btree (file_mime_type);

alter table apflora.tpopmassn_file enable row level security;
drop policy if exists reader on apflora.tpopmassn_file;
create policy reader on apflora.tpopmassn_file 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpopmassn_id in (
      select id
      from apflora.tpopmassn
      where tpop_id in (
        select id
        from apflora.tpop
        where pop_id in (
          select id 
          from apflora.pop
          where ap_id in (
            select ap_id from apflora.ap_user where user_name = current_user_name()
          )
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpopmassn_id in (
      select id
      from apflora.tpopmassn
      where tpop_id in (
        select id
        from apflora.tpop
        where pop_id in (
          select id 
          from apflora.pop
          where ap_id in (
            select ap_id from apflora.ap_user where user_name = current_user_name()
          )
        )
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.tpopmassn_erfbeurt_werte;
CREATE TABLE apflora.tpopmassn_erfbeurt_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) default NULL
);
create sequence apflora.tpopmassn_erfbeurt_werte_code_seq owned by apflora.tpopmassn_erfbeurt_werte.code;
alter table apflora.tpopmassn_erfbeurt_werte alter column code set default nextval('apflora.tpopmassn_erfbeurt_werte_code_seq');
select setval('apflora.tpopmassn_erfbeurt_werte_code_seq', (select max(code)+1 from apflora.tpopmassn_erfbeurt_werte), false);
alter table apflora.tpopmassn_erfbeurt_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (id);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (code);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (sort);
CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.text IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopmassn_erfbeurt_werte enable row level security;
drop policy if exists reader on apflora.tpopmassn_erfbeurt_werte;
create policy reader on apflora.tpopmassn_erfbeurt_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopmassn_typ_werte;
CREATE TABLE apflora.tpopmassn_typ_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  ansiedlung boolean default false,
  anpflanzung boolean default false,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
create sequence apflora.tpopmassn_typ_werte_code_seq owned by apflora.tpopmassn_typ_werte.code;
alter table apflora.tpopmassn_typ_werte alter column code set default nextval('apflora.tpopmassn_typ_werte_code_seq');
select setval('apflora.tpopmassn_typ_werte_code_seq', (select max(code)+1 from apflora.tpopmassn_typ_werte), false);
alter table apflora.tpopmassn_typ_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (id);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (code);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (sort);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (ansiedlung);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (anpflanzung);
CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree (historic);
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.ansiedlung IS 'Handelt es sich um eine Ansiedlung?';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassn_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopmassn_typ_werte enable row level security;
drop policy if exists reader on apflora.tpopmassn_typ_werte;
create policy reader on apflora.tpopmassn_typ_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.tpopmassnber;
CREATE TABLE apflora.tpopmassnber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  beurteilung integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.tpopmassnber USING btree (id);
CREATE INDEX ON apflora.tpopmassnber USING btree (tpop_id);
CREATE INDEX ON apflora.tpopmassnber USING btree (beurteilung);
CREATE INDEX ON apflora.tpopmassnber USING btree (jahr);
COMMENT ON COLUMN apflora.tpopmassnber.id IS 'Primärschlüssel der Tabelle "tpopmassnber"';
COMMENT ON COLUMN apflora.tpopmassnber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus Tabelle "tpop"';
COMMENT ON COLUMN apflora.tpopmassnber.jahr IS 'Jahr, für den der Bericht gilt';
COMMENT ON COLUMN apflora.tpopmassnber.beurteilung IS 'Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte"';
COMMENT ON COLUMN apflora.tpopmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';
COMMENT ON COLUMN apflora.tpopmassnber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.tpopmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.tpopmassnber enable row level security;
drop policy if exists reader on apflora.tpopmassnber;
create policy reader on apflora.tpopmassnber 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.message CASCADE;
CREATE TABLE apflora.message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  message text NOT NULL,
  time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- active is used to prevent to many datasets fro being fetched
  -- old messages can be set inactive, expecially if read by all
  active boolean NOT NULL DEFAULT true
);
CREATE INDEX ON apflora.message USING btree (id);
CREATE INDEX ON apflora.message USING btree (time);
COMMENT ON COLUMN apflora.message.message IS 'Nachricht an die Benutzer';
COMMENT ON COLUMN apflora.message.active IS 'false: diese Nachricht wird nicht mehr übermittelt';

alter table apflora.message enable row level security;
drop policy if exists reader on apflora.message;
create policy reader on apflora.message 
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.currentIssue CASCADE;
CREATE TABLE apflora.currentIssue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  sort smallint default null,
  title text default null,
  issue text default null
);
CREATE INDEX ON apflora.currentIssue USING btree (id);
CREATE INDEX ON apflora.currentIssue USING btree (sort);
CREATE INDEX ON apflora.currentIssue USING btree (title);
COMMENT ON COLUMN apflora.currentIssue.issue IS 'Bekannter Fehler';

alter table apflora.currentIssue enable row level security;
drop policy if exists reader on apflora.currentIssue;
create policy reader on apflora.currentIssue 
using (true)
with check (current_user = 'apflora_manager');


-- list of read messages per user
DROP TABLE IF EXISTS apflora.usermessage;
CREATE TABLE apflora.usermessage (
  user_name varchar(30) NOT NULL REFERENCES apflora.user (name) ON DELETE CASCADE ON UPDATE CASCADE,
  message_id UUID NOT NULL REFERENCES apflora.message (id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE (user_name, message_id)
);
CREATE INDEX ON apflora.usermessage USING btree (id);
CREATE INDEX ON apflora.usermessage USING btree (user_name);
CREATE INDEX ON apflora.usermessage USING btree (message_id);

-- this needs to be written by user when he ok's message
alter table apflora.usermessage enable row level security;
drop policy if exists reader on apflora.usermessage;
create policy reader on apflora.usermessage 
using (user_name = current_user_name() or current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.ziel;
CREATE TABLE apflora.ziel (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ap_id UUID NOT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ integer DEFAULT NULL REFERENCES apflora.ziel_typ_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  bezeichnung text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.ziel USING btree (id);
CREATE INDEX ON apflora.ziel USING btree (ap_id);
CREATE INDEX ON apflora.ziel USING btree (typ);
CREATE INDEX ON apflora.ziel USING btree (jahr);
COMMENT ON COLUMN apflora.ziel.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ziel.ap_id IS 'Zugehöriger Aktionsplan. Fremdschluessel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ziel.typ IS 'Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte"';
COMMENT ON COLUMN apflora.ziel.jahr IS 'In welchem Jahr soll das Ziel erreicht werden?';
COMMENT ON COLUMN apflora.ziel.bezeichnung IS 'Textliche Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ziel enable row level security;
drop policy if exists reader on apflora.ziel;
create policy reader on apflora.ziel 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


DROP TABLE IF EXISTS apflora.ziel_typ_werte;
CREATE TABLE apflora.ziel_typ_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) NOT NULL
);
create sequence apflora.ziel_typ_werte_code_seq owned by apflora.ziel_typ_werte.code;
alter table apflora.ziel_typ_werte alter column code set default nextval('apflora.ziel_typ_werte_code_seq');
select setval('apflora.ziel_typ_werte_code_seq', (select max(code)+1 from apflora.ziel_typ_werte), false);
alter table apflora.ziel_typ_werte alter column changed_by drop not null, alter column changed_by set default null;

CREATE INDEX ON apflora.ziel_typ_werte USING btree (id);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (code);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (sort);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (historic);
COMMENT ON COLUMN apflora.ziel_typ_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ziel_typ_werte.text IS 'Beschreibung des Ziels';
COMMENT ON COLUMN apflora.ziel_typ_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.ziel_typ_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ziel_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ziel_typ_werte enable row level security;
drop policy if exists reader on apflora.ziel_typ_werte;
create policy reader on apflora.ziel_typ_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.zielber;
CREATE TABLE apflora.zielber (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  ziel_id uuid DEFAULT NULL REFERENCES apflora.ziel (id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  erreichung text DEFAULT NULL,
  bemerkungen text DEFAULT NULL,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
CREATE INDEX ON apflora.zielber USING btree (id);
CREATE INDEX ON apflora.zielber USING btree (ziel_id);
CREATE INDEX ON apflora.zielber USING btree (jahr);
COMMENT ON COLUMN apflora.zielber.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.zielber.ziel_id IS 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "ziel"';
COMMENT ON COLUMN apflora.zielber.jahr IS 'Für welches Jahr gilt der Bericht?';
COMMENT ON COLUMN apflora.zielber.erreichung IS 'Beurteilung der Zielerreichung';
COMMENT ON COLUMN apflora.zielber.bemerkungen IS 'Bemerkungen zur Zielerreichung';
COMMENT ON COLUMN apflora.zielber.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.zielber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.zielber enable row level security;
drop policy if exists reader on apflora.zielber;
create policy reader on apflora.zielber 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ziel_id in (
      select id 
      from apflora.ziel
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ziel_id in (
      select id 
      from apflora.ziel
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


DROP TABLE IF EXISTS apflora.evab_typologie;
CREATE TABLE apflora.evab_typologie (
  "TYPO" varchar(9) PRIMARY KEY,
  "LEBENSRAUM" varchar(100),
  "Alliance" varchar(100)
);

alter table apflora.evab_typologie enable row level security;
drop policy if exists reader on apflora.evab_typologie;
create policy reader on apflora.evab_typologie 
using (true)
with check (current_user = 'apflora_manager');


-- this table can not be used as foreign table
-- because it needs to be referenced
drop table if exists apflora.ae_taxonomies;
create table apflora.ae_taxonomies (
  taxonomie_id UUID,
  taxonomie_name text,
  id UUID PRIMARY KEY,
  taxid integer,
  familie text,
  artname text,
  tax_art_name text,
  status text,
  artwert integer
);
create index on apflora.ae_taxonomies (taxonomie_id);
create index on apflora.ae_taxonomies (taxonomie_name);
create index on apflora.ae_taxonomies (id);
create index on apflora.ae_taxonomies (taxid);
create index on apflora.ae_taxonomies (artname);
create index on apflora.ae_taxonomies (tax_art_name);

alter table apflora.ae_taxonomies enable row level security;
drop policy if exists reader on apflora.ae_taxonomies;
create policy reader on apflora.ae_taxonomies 
using (true)
with check (current_user = 'apflora_manager');


-- to update data run:
--truncate apflora.ae_taxonomies;
--insert into apflora.ae_taxonomies(taxonomie_id, taxonomie_name, id, taxid, familie, artname, tax_art_name, status, artwert)
--select
--  taxonomie_id,
--  taxonomie_name,
--  id,
--  taxid,
--  familie,
--  artname,
--  case
--    when taxonomie_id = 'aed47d41-7b0e-11e8-b9a5-bd4f79edbcc4'
--    then concat('SISF2: ', artname)
--    else concat('(Taxonomie unbekannt): ', artname)
--  end,
--  status,
--  artwert
--from apflora.ae_taxonomies_download;
--update apflora.ae_taxonomies
--set tax_art_name = concat('SISF2: ', artname);

--
-- beob can collect beob of any provenience by following this convention:
-- - fields that are used in apflora.ch are appended as regular fields, that is:
--   quelle_id, art_id, datum, autor, geom_point
--   These fields are extracted from the original beob at import
-- - all fields of the original beob are put in jsonb field "data"
--   and shown in the form that lists beob
-- - an id field is generated inside beob because we need a unique one
--   of defined type and id fields sometimes come as integer,
--   sometimes as GUIDS, so neither in a defined type nor unique
--   Worse: sometimes the id is not absolutely clear because no field contains
--   strictly unique values... !!
-- - "id_field" points to the original id in "data"
DROP TABLE IF EXISTS apflora.beob;
CREATE TABLE apflora.beob (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  quelle_id uuid Default Null,
  -- this field in data contains this datasets id
  id_field varchar(38) DEFAULT NULL,
  art_id UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) on delete no action on update cascade,
  -- art_id can be changed. art_id_original documents this change
  art_id_original UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) on delete no action on update cascade,
  -- data without year is not imported
  -- when no month exists: month = 01
  -- when no day exists: day = 01
  datum date DEFAULT NULL,
  -- Nachname Vorname
  autor varchar(100) DEFAULT NULL,
  -- data without coordinates is not imported
  geom_point geometry(Point, 4326) default null,
  -- maybe later add a geojson field for polygons?
  data jsonb,
  quelle_id uuid Default Null REFERENCES apflora.beob_quelle_werte (id) ON DELETE SET NULL ON UPDATE CASCADE,
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop (id) ON DELETE SET NULL ON UPDATE CASCADE,
  nicht_zuordnen boolean default false,
  infoflora_informiert_datum date default null,
  bemerkungen text,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT null
);
create index on apflora.beob using gist (geom_point);
CREATE INDEX ON apflora.beob USING btree (id);
CREATE INDEX ON apflora.beob USING btree (quelle_id);
CREATE INDEX ON apflora.beob USING btree (art_id);
CREATE INDEX ON apflora.beob USING btree (art_id_original);
CREATE INDEX ON apflora.beob USING btree (quelle_id);
CREATE INDEX ON apflora.beob USING btree (tpop_id);
CREATE INDEX ON apflora.beob USING btree (nicht_zuordnen);
CREATE INDEX ON apflora.beob USING btree (infoflora_informiert_datum);
COMMENT ON COLUMN apflora.beob.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.beob.tpop_id IS 'Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop"';
COMMENT ON COLUMN apflora.beob.nicht_zuordnen IS 'Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar';
COMMENT ON COLUMN apflora.beob.infoflora_informiert_datum IS 'Datum, an dem Info Flora über die Verifikation der Beobachtung informiert wurde';
COMMENT ON COLUMN apflora.beob.bemerkungen IS 'Bemerkungen zur Zuordnung';
COMMENT ON COLUMN apflora.beob.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.beob.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.beob enable row level security;
drop policy if exists reader on apflora.beob;
create policy reader on apflora.beob 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader')
  or (
    current_user in ('apflora_ap_reader')
    and art_id in (
      select distinct art_id 
      from apflora.apart
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
)
with check (
  current_user in ('apflora_manager')
  or (
    current_user in ('apflora_ap_writer')
    and art_id in (
      select distinct art_id 
      from apflora.apart
      where ap_id in (
        select ap_id from apflora.ap_user where user_name = current_user_name()
      )
    )
  )
);


-- beobprojekt is used to control
-- what beob are seen in what projekt
-- IT IS NOT YET USED!
DROP TABLE IF EXISTS apflora.beobprojekt;
CREATE TABLE apflora.beobprojekt (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  proj_id UUID NOT NULL REFERENCES apflora.projekt (id) ON DELETE SET NULL ON UPDATE CASCADE,
  beob_id UUID NOT NULL REFERENCES apflora.beob (id) ON DELETE SET NULL ON UPDATE CASCADE,
  UNIQUE (proj_id, beob_id)
);

DROP TABLE IF EXISTS apflora.beob_quelle_werte;
CREATE TABLE apflora.beob_quelle_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  name varchar(255) DEFAULT NULL
);
CREATE INDEX ON apflora.beob_quelle_werte USING btree (id);

alter table apflora.beob_quelle_werte enable row level security;
drop policy if exists reader on apflora.beob_quelle_werte;
create policy reader on apflora.beob_quelle_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.apart;
CREATE TABLE apflora.apart (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  art_id UUID DEFAULT NULL REFERENCES apflora.ae_taxonomies (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  ap_id UUID DEFAULT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  changed date DEFAULT NULL,
  changed_by varchar(20) DEFAULT NULL
  --UNIQUE (art_id) --no, maybe after beob were rearranged
);
CREATE INDEX ON apflora.apart USING btree (id);
CREATE INDEX ON apflora.apart USING btree (ap_id);
CREATE INDEX ON apflora.apart USING btree (art_id);
COMMENT ON COLUMN apflora.apart.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.apart.art_id IS 'Zugehörige Art. Aus der Tabelle "ae_taxonomies"';
COMMENT ON COLUMN apflora.apart.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.apart.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.apart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

alter table apflora.apart enable row level security;
drop policy if exists reader on apflora.apart;
create policy reader on apflora.apart 
using (
  current_user in ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_reader')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
)
with check (
  current_user in ('apflora_manager', 'apflora_freiwillig')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);


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
CREATE UNIQUE INDEX ekzaehleinheit_single_zielrelevant_for_ap_idx ON apflora.ekzaehleinheit (ap_id, zielrelevant) WHERE zielrelevant = 'true';
CREATE UNIQUE INDEX ekzaehleinheit_zaehleinheit_unique_for_ap_idx ON apflora.ekzaehleinheit (ap_id, zaehleinheit_id);
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

alter table apflora.ekzaehleinheit enable row level security;
DROP POLICY IF EXISTS writer ON apflora.ekzaehleinheit;
CREATE POLICY writer ON apflora.ekzaehleinheit
USING (true)
WITH CHECK (current_user = 'apflora_manager');

  
drop type if exists ek_type;
create type ek_type as enum ('ek', 'ekf');
drop type if exists ek_kontrolljahre_ab;
create type ek_kontrolljahre_ab as enum ('ek', 'ansiedlung');

drop table if exists apflora.ekfrequenz;
create table apflora.ekfrequenz(
  id uuid primary key default uuid_generate_v1mc(),
  ap_id uuid not null references apflora.ap (id) on delete cascade on update cascade,
  ektyp ek_type default null,
  anwendungsfall text default null,
  code text default null,
  kontrolljahre integer[],
  kontrolljahre_ab ek_kontrolljahre_ab default null,
  anzahl_min integer default null,
  anzahl_max integer default null,
  bemerkungen text default null,
  sort smallint default null,
  ek_abrechnungstyp text DEFAULT null REFERENCES apflora.ek_abrechnungstyp_werte (code) ON DELETE SET NULL ON UPDATE CASCADE,
  changed date default now(),
  changed_by varchar(20) default null,
  unique(ap_id, code)
);
CREATE INDEX ON apflora.ekfrequenz USING btree (id);
CREATE INDEX ON apflora.ekfrequenz USING btree (ap_id);
CREATE INDEX ON apflora.ekfrequenz USING btree (ektyp);
COMMENT ON COLUMN apflora.ekfrequenz.ektyp IS 'Ob diese Frequenz für EK oder EKF anwendbar ist';
CREATE INDEX ON apflora.ekfrequenz USING btree (anwendungsfall);
CREATE INDEX ON apflora.ekfrequenz USING btree (code);
CREATE INDEX ON apflora.ekfrequenz USING btree (kontrolljahre_ab);
COMMENT ON COLUMN apflora.ekfrequenz.kontrolljahre_ab IS 'Referenzjahr für die Kontrolljahre';
CREATE INDEX ON apflora.ekfrequenz USING btree (sort);
CREATE INDEX ON apflora.ekfrequenz USING btree (ek_abrechnungstyp);
COMMENT ON COLUMN apflora.ekfrequenz.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ekfrequenz.ap_id IS 'Zugehöriger Aktionsplan. Fremdschlüssel aus der Tabelle "ap"';
COMMENT ON COLUMN apflora.ekfrequenz.anwendungsfall IS 'Beschreibt, in welchen Fällen diese Frequenz angewandt wird. Wahrscheinliche Werte: autochthone Population, angepflanzte Population, angesäte Population, Spezialfall';
COMMENT ON COLUMN apflora.ekfrequenz.code IS 'Definierend für die eqfrequenz';
COMMENT ON COLUMN apflora.ekfrequenz.kontrolljahre IS ' Definiert, in welchen Jahren eine Kontrolle üblicherweise stattfinden soll. Bei Anpflanzungen sind das Jahre ab der letzten Anpflanzung. Bei autochthonen Populationen?';
COMMENT ON COLUMN apflora.ekfrequenz.anzahl_min IS 'Ab dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant. Momentan nicht implementiert, weil Ekfrequenz-Typen nicht automatisch gesetzt werden';
COMMENT ON COLUMN apflora.ekfrequenz.anzahl_max IS 'Bis zu dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant. Momentan nicht implementiert, weil Ekfrequenz-Typen nicht automatisch gesetzt werden';
COMMENT ON COLUMN apflora.ekfrequenz.sort IS 'Damit EK-Zähleinheiten untereinander sortiert werden können';
COMMENT ON COLUMN apflora.ekfrequenz.ek_abrechnungstyp IS 'Fremdschlüssel aus Tabelle ek_abrechnungstyp_werte. Bestimmt, wie Kontrollen abgerechnet werden sollen';
COMMENT ON COLUMN apflora.ekfrequenz.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ekfrequenz.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

alter table apflora.ekfrequenz enable row level security;
DROP POLICY IF EXISTS writer ON apflora.ekfrequenz;
CREATE POLICY writer ON apflora.ekfrequenz
USING (true)
WITH CHECK (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.ek_abrechnungstyp_werte;
CREATE TABLE apflora.ek_abrechnungstyp_werte (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v1mc(),
  code text,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean default false,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (id);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (code);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (sort);
CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree (historic);
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ek_abrechnungstyp_werte enable row level security;
drop policy if exists reader on apflora.ek_abrechnungstyp_werte;
create policy reader on apflora.ek_abrechnungstyp_werte
using (true)
with check (current_user = 'apflora_manager');


DROP TABLE IF EXISTS apflora.ekplan;
CREATE TABLE apflora.ekplan (
  id uuid primary key default uuid_generate_v1mc(),
  tpop_id uuid default null references apflora.tpop (id) on delete cascade on update cascade,
  jahr smallint DEFAULT NULL,
  type ek_type default null,
  changed date DEFAULT NOW(),
  changed_by varchar(20) DEFAULT NULL
);
CREATE INDEX ON apflora.ekplan USING btree (id);
CREATE INDEX ON apflora.ekplan USING btree (tpop_id);
CREATE INDEX ON apflora.ekplan USING btree (jahr);
CREATE INDEX ON apflora.ekplan USING btree (type);
COMMENT ON COLUMN apflora.ekplan.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.ekplan.tpop_id IS 'Fremdschlüssel aus der Tabelle tpop';
COMMENT ON COLUMN apflora.ekplan.jahr IS 'Jahr, in dem eine EK geplant ist';
COMMENT ON COLUMN apflora.ekplan.type IS 'ek oder ekf';
COMMENT ON COLUMN apflora.ekplan.changed IS 'Wann wurde der Datensatz zuletzt geändert?';
COMMENT ON COLUMN apflora.ekplan.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

alter table apflora.ekplan enable row level security;
drop policy if exists writer on apflora.ekplan;
create policy writer on apflora.ekplan
using (true)
with check (
  current_user = 'apflora_manager'
  or (
    current_user in ('apflora_ap_writer')
    and tpop_id in (
      select id
      from apflora.tpop
      where pop_id in (
        select id 
        from apflora.pop
        where ap_id in (
          select ap_id from apflora.ap_user where user_name = current_user_name()
        )
      )
    )
  )
);


drop table if exists apflora.qk;
create table apflora.qk (
  name text primary key,
  titel text,
  beschreibung text,
  sort smallint default null
);
create index on apflora.qk using btree (name);
create index on apflora.qk using btree (titel);
create index on apflora.qk using btree (sort);
comment on column apflora.qk.name is 'Primärschlüssel. Wird auch in Abfragen und createMessageFunctions benutzt';

alter table apflora.qk enable row level security;
drop policy if exists reader on apflora.qk;
create policy reader on apflora.qk
using (true)
with check (current_user = 'apflora_manager');


drop table if exists apflora.apqk;
create table apflora.apqk (
  ap_id UUID NOT NULL REFERENCES apflora.ap (id) ON DELETE CASCADE ON UPDATE CASCADE,
  qk_name text NOT NULL REFERENCES apflora.qk (name) ON DELETE CASCADE ON UPDATE CASCADE,
  unique(ap_id, qk_name)
);
create index on apflora.apqk using btree (ap_id);
create index on apflora.apqk using btree (qk_name);

alter table apflora.apqk enable row level security;
drop policy if exists reader on apflora.apqk;
create policy reader on apflora.apqk 
using (true)
with check (
  current_user in ('apflora_manager')
  or (
    current_user in ('apflora_ap_writer')
    and ap_id in (
      select ap_id from apflora.ap_user where user_name = current_user_name()
    )
  )
);

--insert into apflora.apqk (ap_id, qk_name)
--select ap.id, qk.name
--from apflora.qk, apflora.ap
--on conflict do nothing;


-- apflora.ch_gemeinde is imported from:
-- https://data.geo.admin.ch/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/gdb/2056/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill.zip
create index on apflora.ch_gemeinde using btree (name);
comment on table apflora.ch_gemeinde is 'Quelle: https://data.geo.admin.ch/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill/gdb/2056/ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill.zip'

alter table apflora.ch_gemeinde enable row level security;
drop policy if exists reader on apflora.ch_gemeinde;
create policy reader on apflora.ch_gemeinde
using (true)
with check (current_user = 'apflora_manager');


-- apflora.markierungen was received from topos
comment on table apflora.markierungen is 'Markierungen, die im Rahmen von apflora gesetzt wurden. Quelle: Topos'

alter table apflora.markierungen enable row level security;
drop policy if exists reader on apflora.markierungen;
create policy reader on apflora.markierungen
using (true)
with check (current_user = 'apflora_manager');


-- apflora.detailplaene was received from topos
comment on table apflora.detailplaene is 'Detailpläne, die im Rahmen von apflora gesetzt wurden. Quelle: Topos'

alter table apflora.detailplaene enable row level security;
drop policy if exists reader on apflora.detailplaene;
create policy reader on apflora.detailplaene
using (true)
with check (current_user = 'apflora_manager');


--truncate apflora.apqk
--insert into apflora.apqk(ap_id, qk_name)
--select distinct apflora.ap.id, apflora.qk.name from apflora.ap, apflora.qk where apflora.ap.bearbeitung is null


drop table if exists apflora.ns_betreuung;
create table apflora.ns_betreuung (
  gebiet_nr integer primary key,
  gebiet_name text,
  firma text,
  projektleiter text,
  telefon text
);
create index on apflora.ns_betreuung using btree (gebiet_nr);
comment on table apflora.ns_betreuung is 'Von der FNS. Um zu das wfs betreuungsgebiete mit den Betreuern zu verknüpfen';

alter table apflora.ns_betreuung enable row level security;
drop policy if exists reader on apflora.ns_betreuung;
create policy reader on apflora.ns_betreuung
using (true)
with check (current_user = 'apflora_manager');
