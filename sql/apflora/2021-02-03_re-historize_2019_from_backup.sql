-- 1. reinstate data from 5.3.2020 in local dev env

-- 2. historize in local dev env

truncate apflora.tpop_history;
truncate apflora.pop_history;
truncate apflora.ap_history;

insert into apflora.ap_history
select
  2019 as year,
  id,
  art_id,
  proj_id,
  bearbeitung,
  start_jahr,
  umsetzung,
  bearbeiter,
  ekf_beobachtungszeitpunkt,
  changed,
  changed_by
from apflora.ap;

insert into apflora.pop_history
select
  2019 as year,
  id,
  ap_id,
  nr,
  name,
  status,
  status_unklar,
  status_unklar_begruendung,
  bekannt_seit,
  geom_point,
  changed,
  changed_by
from apflora.pop;

insert into apflora.tpop_history (
  year,
  id,
  pop_id,
  nr, 
  gemeinde,
  flurname,
  geom_point,
  radius,
  hoehe,
  exposition,
  klima,
  neigung,
  beschreibung,
  kataster_nr,
  status,
  status_unklar,
  status_unklar_grund,
  apber_relevant,
  apber_relevant_grund,
  bekannt_seit,
  eigentuemer,
  kontakt,
  nutzungszone,
  bewirtschafter,
  bewirtschaftung,
  ekfrequenz,
  ekfrequenz_startjahr,
  ekfrequenz_abweichend,
  ekf_kontrolleur,
  bemerkungen,
  changed,
  changed_by
)
select
  2019 as year,
  id,
  pop_id,
  nr, 
  gemeinde,
  flurname,
  geom_point,
  radius,
  hoehe,
  exposition,
  klima,
  neigung,
  beschreibung,
  kataster_nr,
  status,
  status_unklar,
  status_unklar_grund,
  apber_relevant,
  apber_relevant_grund,
  bekannt_seit,
  eigentuemer,
  kontakt,
  nutzungszone,
  bewirtschafter,
  bewirtschaftung,
  ekfrequenz,
  ekfrequenz_startjahr,
  ekfrequenz_abweichend,
  ekf_kontrolleur,
  bemerkungen,
  changed,
  changed_by
from apflora.tpop;

-- 3. update 2019 values on productive server with this date

-- 3.1 create temporary tables

CREATE TABLE apflora.ap_history_tmp (
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

CREATE TABLE apflora.pop_history_tmp (
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

CREATE TABLE apflora.tpop_history_tmp (
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

-- 3.2 import export from local dev tables to production tmp tables

-- 3.3 empty 2019 values

delete from apflora.tpop_history where apflora.tpop_history.year = 2019;
delete from apflora.pop_history where apflora.pop_history.year = 2019;
delete from apflora.ap_history where apflora.ap_history.year = 2019;

-- 3.4. add 2019 values from tmp tables to productive tables

insert into apflora.ap_history (
  year,
  id,
  art_id,
  proj_id,
  bearbeitung,
  start_jahr,
  umsetzung,
  bearbeiter,
  ekf_beobachtungszeitpunkt,
  changed,
  changed_by
)
select
  year,
  id,
  art_id,
  proj_id,
  bearbeitung,
  start_jahr,
  umsetzung,
  bearbeiter,
  ekf_beobachtungszeitpunkt,
  changed,
  changed_by
from apflora.ap_history_tmp;

insert into apflora.pop_history (
  year,
  id,
  ap_id,
  nr,
  name,
  status,
  status_unklar,
  status_unklar_begruendung,
  bekannt_seit,
  geom_point,
  changed,
  changed_by
)
select
  year,
  id,
  ap_id,
  nr,
  name,
  status,
  status_unklar,
  status_unklar_begruendung,
  bekannt_seit,
  geom_point,
  changed,
  changed_by
from apflora.pop_history_tmp;

insert into apflora.tpop_history (
  year,
  id,
  pop_id,
  nr, 
  gemeinde,
  flurname,
  geom_point,
  radius,
  hoehe,
  exposition,
  klima,
  neigung,
  beschreibung,
  kataster_nr,
  status,
  status_unklar,
  status_unklar_grund,
  apber_relevant,
  apber_relevant_grund,
  bekannt_seit,
  eigentuemer,
  kontakt,
  nutzungszone,
  bewirtschafter,
  bewirtschaftung,
  ekfrequenz,
  ekfrequenz_startjahr,
  ekfrequenz_abweichend,
  ekf_kontrolleur,
  bemerkungen,
  changed,
  changed_by
)
select
  year,
  id,
  pop_id,
  nr, 
  gemeinde,
  flurname,
  geom_point,
  radius,
  hoehe,
  exposition,
  klima,
  neigung,
  beschreibung,
  kataster_nr,
  status,
  status_unklar,
  status_unklar_grund,
  apber_relevant,
  apber_relevant_grund,
  bekannt_seit,
  eigentuemer,
  kontakt,
  nutzungszone,
  bewirtschafter,
  bewirtschaftung,
  ekfrequenz,
  ekfrequenz_startjahr,
  ekfrequenz_abweichend,
  ekf_kontrolleur,
  bemerkungen,
  changed,
  changed_by
from apflora.tpop_history_tmp;

-- 3.5 update apflora.apberuebersicht.history_date
update apflora.apberuebersicht
set history_date = '2020-03-05' where jahr = 2019;


-- 3.6. remove tmp tables
drop TABLE apflora.ap_history_tmp;
drop TABLE apflora.pop_history_tmp;
drop TABLE apflora.tpop_history_tmp;

-- 4. recreate Jahresbericht 2020