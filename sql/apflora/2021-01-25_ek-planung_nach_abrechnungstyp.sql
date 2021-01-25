DROP VIEW IF EXISTS apflora.v_ek_planung_nach_abrechnungstyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_ek_planung_nach_abrechnungstyp AS
select
  tax.artname,
  adresse.name as artverantwortlich,
  ekplan.jahr,
  ek_abrechnungstyp_werte.text as ek_abrechnungstyp,
  count(ekplan.id) as anzahl
from
  apflora.ekplan ekplan
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
        left join apflora.adresse adresse
        on adresse.id = ap.bearbeiter
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = ekplan.tpop_id
  inner join apflora.ekfrequenz ekfrequenz
    inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
    on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
  on tpop.ekfrequenz = ekfrequenz.id
where
  tax.taxid > 150
group by
  tax.artname,
  adresse.name,
  ekplan.jahr,
  ek_abrechnungstyp_werte.text
order by
  tax.artname,
  ekplan.jahr,
  ek_abrechnungstyp_werte.text;

select colpivot('_ek_planung_nach_abrechnungstyp', 'select * from apflora.v_ek_planung_nach_abrechnungstyp',
    array['artname', 'artverantwortlich', 'jahr'], array['ek_abrechnungstyp'], '#.anzahl', null);
select * from _ek_planung_nach_abrechnungstyp order by artname, jahr;
  