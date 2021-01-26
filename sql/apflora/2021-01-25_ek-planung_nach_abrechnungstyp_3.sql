DROP VIEW IF EXISTS apflora.v_ek_planung_nach_abrechnungstyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_ek_planung_nach_abrechnungstyp AS
with data as (
  select
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.code as ek_abrechnungstyp,
    count(ekplan.id)::int as anzahl
  from
    apflora.ekplan ekplan
    inner join apflora.tpop tpop
      inner join apflora.pop pop
        inner join apflora.ap ap
          inner join apflora.ae_taxonomies tax
          on tax.id = ap.art_id
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
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.code
)
select
  tax.artname,
  ap.id as ap_id,
  adresse.name as artverantwortlich,
  ekplan.jahr,
  (select anzahl from data where id = ap.id and jahr = ekplan.jahr and ek_abrechnungstyp = 'A') as A,
  (select anzahl from data where id = ap.id and jahr = ekplan.jahr and ek_abrechnungstyp = 'B') as B,
  (select anzahl from data where id = ap.id and jahr = ekplan.jahr and ek_abrechnungstyp = 'D') as D,
  (select anzahl from data where id = ap.id  and jahr = ekplan.jahr and ek_abrechnungstyp = 'EKF') as EKF
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
  ap.id,
  adresse.name,
  ekplan.jahr
order by
  tax.artname,
  ekplan.jahr;