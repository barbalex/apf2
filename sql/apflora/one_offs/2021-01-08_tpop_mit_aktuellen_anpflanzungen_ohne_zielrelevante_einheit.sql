DROP VIEW IF EXISTS apflora.v_q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_q_tpop_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit AS
with tpop_mit_aktuellen_anpflanzungen as (
  select distinct
    apflora.tpop.id
  from
    apflora.tpop
    inner join apflora.tpopmassn
      inner join apflora.tpopmassn_typ_werte
      on apflora.tpopmassn_typ_werte.code = apflora.tpopmassn.typ
    on apflora.tpop.id = apflora.tpopmassn.tpop_id
  where
    apflora.tpopmassn.jahr = date_part('year', CURRENT_DATE)
    and apflora.tpopmassn_typ_werte.anpflanzung = true
    and (
      apflora.tpopmassn.zieleinheit_einheit is null
      or apflora.tpopmassn.zieleinheit_anzahl is null
    )
)
SELECT
  apflora.projekt.id as proj_id,
  apflora.ap.id as ap_id,
  apflora.pop.id as pop_id,
  apflora.pop.nr as pop_nr,
  apflora.tpop.id,
  apflora.tpop.nr
FROM
  apflora.projekt
  INNER JOIN apflora.ap
    INNER JOIN apflora.pop
      INNER JOIN apflora.tpop
        inner join tpop_mit_aktuellen_anpflanzungen
        on tpop_mit_aktuellen_anpflanzungen.id = apflora.tpop.id
      ON apflora.pop.id = apflora.tpop.pop_id
    ON apflora.ap.id = apflora.pop.ap_id
  ON apflora.projekt.id = apflora.ap.proj_id
ORDER BY
  apflora.pop.nr,
  apflora.tpop.nr;



-- ensure this qk is choosen:
insert into apflora.apqk (ap_id, qk_name)
select distinct
  id as ap_id,
  'tpopMitAktuellenAnpflanzungenOhneZielrelevanteEinheit' as qk_name
from apflora.ap ap
inner join apflora.apqk qk
on ap.id = qk.ap_id
on conflict do nothing;