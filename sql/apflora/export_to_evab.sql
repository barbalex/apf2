-- add EvAB-Data to all adressen that contain evab_id_person:
update apflora.adresse
set
  evab_nachname = subquery.name,
  evab_vorname = subquery.vorname,
  evab_ort = subquery.ort
from (
  select
    adresse.id,
    evab_personen.name,
    evab_personen.vorname,
    evab_personen.ort
  from apflora.adresse
  inner join apflora.evab_personen on evab_personen.idperson = adresse.evab_id_person
  where
    evab_nachname is null
    or evab_vorname is null
    or evab_ort is null
) as subquery
where adresse.id = subquery.id;

-- list adressen with all needed evab-data but without evab_id_person:
-- these need to be added in EvAB (if we do not want to create new personen)
-- but: adding makes no sense as they do not seem to be contained in future templates :-(
select * from apflora.adresse
where
  (
    evab_nachname is not null
    and evab_vorname is not null
    and evab_ort is not null
  )
  AND adresse.evab_id_person IS NULL
order by
  evab_nachname,
  evab_vorname;

-- these need to be manually corrected first:
select name from apflora.adresse
where
  adresse.evab_id_person IS NULL
  and (
    evab_nachname is null
    or evab_vorname is null
    or evab_ort is null
  )
order by name;

-- to add evab_id_person list evab_personen by name:
select * from apflora.evab_personen
order by name, vorname;

-- check if previously added ids do not exist any more
select id from apflora.adresse where evab_id_person not in (select idperson from apflora.evab_personen);
-- result: 108 rows!!!!???
-- conclusion: idPerson from EvAB is unusable. NEED TO CREATE NEW USER FOR EVERY USER :-(