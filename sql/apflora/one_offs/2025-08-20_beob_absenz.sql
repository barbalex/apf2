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



CREATE OR REPLACE FUNCTION beob_extract_absenz(_beob apflora.beob)
  RETURNS boolean
  AS $$
DECLARE
  result boolean;
BEGIN
  IF _beob.data ->> 'presence' IS NULL THEN
    result = false;
  ELSIF _beob.data ->> 'presence' <> '+' THEN
    result = true;
  ELSE
    result = false; -- no information available
  END IF;
  RETURN result;
END;
$$
LANGUAGE plpgsql;


select 
  beob.quelle,
  beob.data ->> 'presence' AS presence,
  beob.data ->> 'interpretation_note' AS interpretation_note,
  beob_extract_absenz(beob) AS absent,
  count(*) AS count
from
  apflora.beob beob
  left join apflora.ae_taxonomies tax on beob.art_id = tax.id
group by
  beob.quelle,
  beob.data ->> 'presence',
  beob.data ->> 'interpretation_note',
  beob_extract_absenz(beob)
order by
  beob.quelle;