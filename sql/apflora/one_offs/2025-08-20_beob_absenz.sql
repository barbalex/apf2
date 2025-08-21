-- query beob, group by data.presence and data.interpretation_note, count rows
select 
  quelle,
  data ->> 'presence' AS presence,
  data ->> 'interpretation_note' AS interpretation_note,
  count(*) AS count
from
  apflora.beob
group by
  quelle,
  data ->> 'presence',
  data ->> 'interpretation_note'
order by
  quelle;

-- select data from apflora.beob where quelle = 'EvAB 2016'
select
  quelle,
  data ->> 'PRESENCE_'
from
  apflora.beob
where
  quelle = 'EvAB 2016';

-- select data from apflora.beob where quelle = 'FloZ 2017'
-- result: no absence information available
select
  quelle,
  data
from
  apflora.beob
where
  quelle = 'FloZ 2017';



CREATE OR REPLACE FUNCTION beob_extract_absenz(_beob apflora.beob)
  RETURNS boolean
  AS $$
DECLARE
  result boolean;
BEGIN
  IF _beob.quelle = 'EvAB 2016' THEN
    IF _beob.data ->> 'PRESENCE_' IS NULL THEN
      result = false;
    ELSIF _beob.data ->> 'PRESENCE_' <> '+' THEN
      result = true;
    ELSE
      result = false; -- no information available
    END IF;
  ELSE
    IF _beob.data ->> 'presence' IS NULL THEN
      result = false;
    ELSIF _beob.data ->> 'presence' <> '+' THEN
      result = true;
    ELSE
      result = false; -- no information available
    END IF;
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;


select 
  beob.quelle,
  beob.data ->> 'presence' AS presence,
  beob.data ->> 'interpretation_note' AS interpretation_note,
  data ->> 'PRESENCE_' AS presence_evab,
  beob_extract_absenz(beob) AS absenz,
  count(*) AS count
from
  apflora.beob beob
  left join apflora.ae_taxonomies tax on beob.art_id = tax.id
group by
  beob.quelle,
  beob.data ->> 'presence',
  beob.data ->> 'interpretation_note',
  data ->> 'PRESENCE_',
  beob_extract_absenz(beob)
order by
  beob.quelle;

-- add absenz column to beob table
ALTER TABLE apflora.beob
ADD COLUMN absenz boolean DEFAULT FALSE; 

-- index for absenz column where absenz is true
CREATE INDEX idx_beob_absenz_true ON apflora.beob (absenz) WHERE absenz = true;

-- update absenz column based on data presence
UPDATE apflora.beob
SET absenz = beob_extract_absenz(beob);

select 
  beob.quelle,
  beob.data ->> 'presence' AS presence,
  beob.data ->> 'interpretation_note' AS interpretation_note,
  data ->> 'PRESENCE_' AS presence_evab,
  absenz,
  count(*) AS count
from
  apflora.beob beob
group by
  beob.quelle,
  beob.data ->> 'presence',
  beob.data ->> 'interpretation_note',
  data ->> 'PRESENCE_',
  absenz
order by
  beob.quelle;