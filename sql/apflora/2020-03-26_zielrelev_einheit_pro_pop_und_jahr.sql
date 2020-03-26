DROP VIEW IF EXISTS apflora.v_ap_ausw_pop_zielrelev_einheit CASCADE;
CREATE OR REPLACE VIEW apflora.v_ap_ausw_pop_zielrelev_einheit AS
with
  sums_per_tpop_per_year as (
    select
      tpop.id as tpop_id,
      anzahl.*
    from crosstab($$
      select tpop_id, jahr, zaehleinheit, anzahl
      from 
        (
          with nr_of_kontr as ( -- TODO: der ziel-einheit
            select tpop0.id, count(kontr0.id) as anzahl
            from 
              apflora.tpop tpop0
              left join apflora.tpopkontr kontr0
                inner join apflora.tpopkontrzaehl zaehl0
                on zaehl0.tpopkontr_id = kontr0.id
              on kontr0.tpop_id = tpop0.id
              inner join apflora.pop pop0
                inner join apflora.ap ap0
                  inner join apflora.ekzaehleinheit ekze0
                    inner join apflora.tpopkontrzaehl_einheit_werte ze0
                    on ze0.id = ekze0.zaehleinheit_id
                  on ekze0.ap_id = ap0.id and ekze0.zielrelevant = true
                on ap0.id = pop0.ap_id
              on pop0.id = tpop0.pop_id
            where
              zaehl0.einheit = ze0.code
            group by tpop0.id
          ), 
          letzte_ansiedlungen as (
            select distinct on (tpop1.id)
              tpop1.id as tpop_id,
              massn1.id as massn_id
            from
              apflora.tpopmassn massn1
              inner join apflora.tpop tpop1
                inner join apflora.pop pop1
                  inner join apflora.ap ap1
                    inner join apflora.ekzaehleinheit ekze1
                      inner join apflora.tpopkontrzaehl_einheit_werte ze1
                      on ze1.id = ekze1.zaehleinheit_id
                    on ekze1.ap_id = ap1.id and ekze1.zielrelevant = true
                  on ap1.id = pop1.ap_id
                on pop1.id = tpop1.pop_id
              on tpop1.id = massn1.tpop_id
              inner join apflora.tpopmassn_typ_werte
              on apflora.tpopmassn_typ_werte.code = massn1.typ
            where
              massn1.jahr is not null
              and tpopmassn_typ_werte.anpflanzung = true
              and massn1.zieleinheit_einheit = ze1.code -- = ziel-einheit
              and massn1.zieleinheit_anzahl is not null
            order by
              tpop1.id,
              massn1.jahr desc,
              massn1.datum desc
          )
          select * from (
            select distinct on (tpop2.id)
              tpop2.id as tpop_id,
              massn2.jahr,
              ze2.text as zaehleinheit,
              massn2.zieleinheit_anzahl as anzahl
            from
              apflora.tpopmassn massn2
              inner join letzte_ansiedlungen
              on letzte_ansiedlungen.massn_id = massn2.id and letzte_ansiedlungen.tpop_id = massn2.tpop_id
              inner join apflora.tpop tpop2
                inner join nr_of_kontr
                on nr_of_kontr.id = tpop2.id
                inner join apflora.pop pop2
                  inner join apflora.ap ap2
                    inner join apflora.ekzaehleinheit ekze2
                      inner join apflora.tpopkontrzaehl_einheit_werte ze2
                      on ze2.id = ekze2.zaehleinheit_id
                    on ekze2.ap_id = ap2.id and ekze2.zielrelevant = true
                  on ap2.id = pop2.ap_id
                on pop2.id = tpop2.pop_id
              on tpop2.id = massn2.tpop_id
            where
              massn2.jahr is not null
              and tpop2.status in (200, 201)
              and nr_of_kontr.anzahl = 0
              and massn2.zieleinheit_anzahl is not null
            order by
              tpop2.id,
              massn2.jahr desc,
              massn2.datum desc
          ) as massn_menge
          union
          select * from (
            select distinct on (tpop3.id, apflora.tpopkontrzaehl_einheit_werte.text)
              tpop3.id as tpop_id,
              kontr3.jahr,
              apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
              zaehl3.anzahl
            from
              apflora.tpopkontrzaehl zaehl3
              inner join apflora.tpopkontrzaehl_einheit_werte
              on apflora.tpopkontrzaehl_einheit_werte.code = zaehl3.einheit
              inner join apflora.tpopkontr kontr3
                inner join apflora.tpop tpop3
                  inner join apflora.pop pop3
                    inner join apflora.ap ap3
                      inner join apflora.ekzaehleinheit ekze3
                        inner join apflora.tpopkontrzaehl_einheit_werte ze3
                        on ze3.id = ekze3.zaehleinheit_id
                      on ekze3.ap_id = ap3.id and ekze3.zielrelevant = true
                    on ap3.id = pop3.ap_id
                  on pop3.id = tpop3.pop_id
                on tpop3.id = kontr3.tpop_id
              on zaehl3.tpopkontr_id = kontr3.id
            where
              -- nur Kontrollen mit Jahr berücksichtigen
              kontr3.jahr is not null
              -- nur Zählungen mit der Ziel-Einheit
              and ze3.code = zaehl3.einheit
              -- nur Zählungen mit Anzahl berücksichtigen
              and zaehl3.anzahl is not null
              and kontr3.id = (
                select
                  kontr4.id
                from
                  apflora.tpopkontrzaehl zaehl4
                  inner join apflora.tpopkontr kontr4
                    inner join apflora.tpop tpop4
                    on tpop4.id = kontr4.tpop_id
                  on zaehl4.tpopkontr_id = kontr4.id
                where
                  kontr4.jahr is not null
                  and zaehl4.anzahl is not null
                  and kontr4.tpop_id = tpop3.id
                order by
                  kontr4.jahr desc,
                  kontr4.datum desc
                limit 1
              )
            order by
              tpop3.id,
              apflora.tpopkontrzaehl_einheit_werte.text,
              kontr3.jahr desc,
              kontr3.datum desc
          ) as zaehl_menge
        ) as tbl
      order by 1,2,3
      $$,
      $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
    ) as anzahl ("tpop_id" uuid, "jahr" integer, "Pflanzen" integer, "Pflanzen (ohne Jungpflanzen)" integer, "Triebe" integer, "Triebe Beweidung" integer, "Keimlinge" integer, "Rosetten" integer, "Jungpflanzen" integer, "Blätter" integer, "blühende Pflanzen" integer, "blühende Triebe" integer, "Blüten" integer, "Fertile Pflanzen" integer, "fruchtende Triebe" integer, "Blütenstände" integer, "Fruchtstände" integer, "Gruppen" integer, "Deckung (%)" integer, "Pflanzen/5m2" integer, "Triebe in 30 m2" integer, "Triebe/50m2" integer, "Triebe Mähfläche" integer, "Fläche (m2)" integer, "Pflanzstellen" integer, "Stellen" integer, "andere Zaehleinheit" integer, "Art ist vorhanden" text)
    inner join apflora.tpop tpop
      inner join apflora.pop pop
        inner join apflora.ap
          inner join apflora.ae_taxonomies tax
          on ap.art_id = tax.id
        on apflora.ap.id = pop.ap_id
      on pop.id = tpop.pop_id
    on tpop.id = anzahl.tpop_id
    order BY
      tax.artname,
      pop.nr,
      tpop.nr;
  ),
  pop_data as (
    select
      ap.id as ap_id,
      ew.text as zaehleinheit,
      pop.year,
      pop.id as pop_id,
      count(tpop.id) as anzahl
      from
        apflora.pop_history pop
        inner join apflora.ap_history ap
          inner join apflora.ekzaehleinheit ekze
            inner join apflora.tpopkontrzaehl_einheit_werte ew
            on ekze.zaehleinheit_id = ew.id
          on ap.id = ekze.ap_id and ekze.zielrelevant = true
        on ap.id = pop.ap_id
        inner join apflora.tpop_history tpop
        on pop.id = tpop.pop_id
      where 
        pop.status in (100, 200, 201)
        and tpop.status in (100, 200, 201)
        and tpop.apber_relevant = true
      group by
        ap.id,
        ew.text,
        pop.year,
        pop.id
      order by
        ap.id,
        pop.year
  )
select
  ap_id,
  zaehleinheit,
  year as jahr,
  json_object_agg(pop_id, anzahl) as values
from pop_data
group by ap_id, zaehleinheit, year
order by ap_id, year;