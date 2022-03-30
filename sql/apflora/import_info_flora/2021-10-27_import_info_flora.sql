-- list beob where art_id can or can not now be added
select data->>'obs_id' as obs_id,
  data->>'no_isfs' as no_isfs,
  data->>'taxon' as taxon,
  (
    select id
    from apflora.ae_taxonomies
    where taxid = (data->>'no_isfs')::integer
  ) as new_art_id
from apflora.beob
where quelle = 'Info Flora 2021.05'
  and art_id is null
order by data->>'taxon',
  data->>'no_isfs';
-- update art_id for beob where possible
update apflora.beob
set art_id = (
    select id
    from apflora.ae_taxonomies
    where taxid = (data->>'no_isfs')::integer
  )
where quelle = 'Info Flora 2021.05'
  and art_id is null
  and (
    select id
    from apflora.ae_taxonomies
    where taxid = (data->>'no_isfs')::integer
  ) is not null;