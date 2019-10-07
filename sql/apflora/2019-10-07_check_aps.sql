select
  apflora.ae_eigenschaften.artname,
  apflora.ap.bearbeitung,
  apflora.ap.start_jahr,
  apflora.ap.umsetzung,
  apflora.ap_umsetzung_werte.text as umsetzung_uncodiert
from apflora.ap 
  inner join apflora.ae_eigenschaften
  on apflora.ap.art_id = apflora.ae_eigenschaften.id
  left join
    apflora.ap_umsetzung_werte
    on apflora.ap.umsetzung = apflora.ap_umsetzung_werte.code
where
	bearbeitung is null
	and umsetzung is not null
order by
  apflora.ae_eigenschaften.artname;