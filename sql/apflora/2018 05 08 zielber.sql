
-- check if year in zielber makes sense
select
  apflora.ae_eigenschaften.artname,
  apflora.ziel.jahr,
  apflora.ziel.bezeichnung
from
  apflora.ziel
  inner join apflora.ap
    inner join apflora.ae_eigenschaften
    on apflora.ae_eigenschaften.id = apflora.ap.art_id
  on apflora.ap.id = apflora.ziel.ap_id
where apflora.ziel.id in (
  select ziel_id from apflora.zielber
  group by ziel_id
  having count(*) > 1
) and apflora.ae_eigenschaften.artname not in ('Abies alba Mill. (Weiss-Tanne)');

select
  apflora.ae_eigenschaften.artname,
  apflora.ziel.jahr,
  apflora.ziel.bezeichnung,
  apflora.zielber.jahr
from
  apflora.ziel
  inner join apflora.ap
    inner join apflora.ae_eigenschaften
    on apflora.ae_eigenschaften.id = apflora.ap.art_id
  on apflora.ap.id = apflora.ziel.ap_id
  inner join apflora.zielber
  on apflora.ziel.id = apflora.zielber.ziel_id
where
  apflora.ziel.jahr <> apflora.zielber.jahr
  and apflora.ae_eigenschaften.artname not in ('Abies alba Mill. (Weiss-Tanne)');

select ziel_id from apflora.zielber
group by ziel_id
having count(*) = 1

select count(*) from apflora.zielber
select * from apflora.zielber where bemerkungen is not null