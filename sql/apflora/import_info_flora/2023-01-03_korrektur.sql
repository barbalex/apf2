CREATE TABLE apflora.tmp_beob_to_delete (
  obs_id integer
);

CREATE INDEX ON apflora.tmp_beob_to_delete USING btree (obs_id);

DELETE FROM apflora.beob beob
WHERE obs_id IN (
    SELECT
      obs_id
    FROM
      apflora.tmp_beob_to_delete);

