select
  ap.art_id as "objectId",
  -- tax.artname as artname,
  ap.start_jahr as "Beginn im Jahr",
  uw.text as "Stand AP-Umsetzung",
  bw.text as "Stand AP-Bearbeitung",
  'https://ucarecdn.com/' || f.file_id || '/-/inline/no/'  as "Link zum AP-Bericht"
from apflora.ap ap
inner join apflora.ae_taxonomies tax on tax.id = ap.art_id
inner join apflora.ap_bearbstand_werte bw on bw.code = ap.bearbeitung
inner join apflora.ap_umsetzung_werte uw on uw.code = ap.umsetzung
left join apflora.ap_file f on f.ap_id = ap.id and f.name Like '%AP.pdf' 
where bw.code < 4;