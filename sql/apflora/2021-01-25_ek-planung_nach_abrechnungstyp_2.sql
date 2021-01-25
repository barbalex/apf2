DROP VIEW IF EXISTS apflora.v_ek_planung_nach_abrechnungstyp CASCADE;
CREATE OR REPLACE VIEW apflora.v_ek_planung_nach_abrechnungstyp AS
with a as (
  select
    ap.id,
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
        on ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on tpop.id = ekplan.tpop_id
    inner join apflora.ekfrequenz ekfrequenz
      inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
      on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
    on tpop.ekfrequenz = ekfrequenz.id
  where
    tax.taxid > 150
    and ek_abrechnungstyp_werte.code = 'A'
  group by
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.text
), b as (
  select
    ap.id,
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
        on ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on tpop.id = ekplan.tpop_id
    inner join apflora.ekfrequenz ekfrequenz
      inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
      on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
    on tpop.ekfrequenz = ekfrequenz.id
  where
    tax.taxid > 150
    and ek_abrechnungstyp_werte.code = 'B'
  group by
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.text
), d as (
  select
    ap.id,
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
        on ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on tpop.id = ekplan.tpop_id
    inner join apflora.ekfrequenz ekfrequenz
      inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
      on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
    on tpop.ekfrequenz = ekfrequenz.id
  where
    tax.taxid > 150
    and ek_abrechnungstyp_werte.code = 'D'
  group by
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.text
), ekf as (
  select
    ap.id,
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
        on ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on tpop.id = ekplan.tpop_id
    inner join apflora.ekfrequenz ekfrequenz
      inner join apflora.ek_abrechnungstyp_werte ek_abrechnungstyp_werte
      on ek_abrechnungstyp_werte.code = ekfrequenz.ek_abrechnungstyp
    on tpop.ekfrequenz = ekfrequenz.id
  where
    tax.taxid > 150
    and ek_abrechnungstyp_werte.code = 'EKF'
  group by
    ap.id,
    ekplan.jahr,
    ek_abrechnungstyp_werte.text
)
select
  tax.artname,
  ap.id,
  adresse.name as artverantwortlich,
  ekplan.jahr,
  (select anzahl from a where id = ap.id  and jahr = ekplan.jahr) as A,
  (select anzahl from b where id = ap.id  and jahr = ekplan.jahr) as B,
  (select anzahl from d where id = ap.id  and jahr = ekplan.jahr) as D,
  (select anzahl from ekf where id = ap.id  and jahr = ekplan.jahr) as EKF
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