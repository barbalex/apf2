alter table apflora.nsbetreuung add column gebiet_nr integer;

update apflora.nsbetreuung set gebiet_nr = nr::integer;

UPDATE
  apflora.ns_betreuung
SET
  geom =(
    SELECT
      wkb_geometry
    FROM
      apflora.nsbetreuung
    WHERE
      apflora.nsbetreuung.gebiet_nr = apflora.ns_betreuung.gebiet_nr);

