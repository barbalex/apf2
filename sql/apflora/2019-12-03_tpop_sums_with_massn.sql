-- crosstab
select 
  tax.artname,
  ap.id as ap_id,
  pop.nr as pop_nr,
  pop.id as pop_id,
  tpop.nr as tpop_nr,
  anzahl.*
from crosstab($$
  select tpop_id, jahr, zaehleinheit, anzahl
  from 
    (
      with nr_of_kontr as (
        select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
        from 
          apflora.tpop
          left join apflora.tpopkontr
          on apflora.tpopkontr.tpop_id = apflora.tpop.id
        group by apflora.tpop.id
      ), letzte_ansiedlungen as (
        select distinct on (tpop1.id)
          tpop1.id as tpop_id,
          massn1.id as massn_id
        from
          apflora.tpopmassn massn1
          inner join apflora.tpop tpop1
          on tpop1.id = massn1.tpop_id
          inner join apflora.tpopmassn_typ_werte
          on apflora.tpopmassn_typ_werte.code = massn1.typ
        where
          massn1.jahr is not null
          and tpopmassn_typ_werte.ansiedlung = -1
          and (
            massn1.anz_triebe is not null
            or massn1.anz_pflanzen is not null
            or massn1.anz_pflanzstellen is not null
          )
        order by
          tpop1.id,
          massn1.jahr desc,
          massn1.datum desc

      )
      select * from (
        select distinct on (tpop2.id)
          tpop2.id as tpop_id,
          massn2.jahr,
          'Triebe' as zaehleinheit,
          massn2.anz_triebe as anzahl
        from
          apflora.tpopmassn massn2
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn2.id and letzte_ansiedlungen.tpop_id = massn2.tpop_id
          inner join apflora.tpop tpop2
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop2.id
          on tpop2.id = massn2.tpop_id
        where
          massn2.jahr is not null
          and tpop2.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn2.anz_triebe is not null
        order by
          tpop2.id,
          massn2.jahr desc,
          massn2.datum desc
      ) as triebe
      union
      select * from (
        select distinct on (tpop3.id)
          tpop3.id as tpop_id,
          massn3.jahr,
          'Pflanzen' as zaehleinheit,
          massn3.anz_pflanzen as anzahl
        from
          apflora.tpopmassn massn3
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn3.id and letzte_ansiedlungen.tpop_id = massn3.tpop_id
          inner join apflora.tpop tpop3
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop3.id
          on tpop3.id = massn3.tpop_id
        where
          massn3.jahr is not null
          and tpop3.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn3.anz_pflanzen is not null
        order by
          tpop3.id,
          massn3.jahr desc,
          massn3.datum desc
      ) as pflanzen
      union
      select * from (
        select distinct on (tpop4.id)
          tpop4.id as tpop_id,
          massn4.jahr,
          'Pflanzstellen' as zaehleinheit,
          massn4.anz_pflanzstellen as anzahl
        from
          apflora.tpopmassn massn4
          inner join letzte_ansiedlungen
          on letzte_ansiedlungen.massn_id = massn4.id and letzte_ansiedlungen.tpop_id = massn4.tpop_id
          inner join apflora.tpop tpop4
            inner join nr_of_kontr
            on nr_of_kontr.id = tpop4.id
          on tpop4.id = massn4.tpop_id
        where
          massn4.jahr is not null
          and tpop4.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and massn4.anz_pflanzstellen is not null
        order by
          tpop4.id,
          massn4.jahr desc,
          massn4.datum desc
      ) as pflanzstellen
      union
      select * from (
        select distinct on (tpop5.id, apflora.tpopkontrzaehl_einheit_werte.text)
          tpop5.id as tpop_id,
          kontr5.jahr,
          apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
          zaehl5.anzahl
        from
          apflora.tpopkontrzaehl zaehl5
          inner join apflora.tpopkontrzaehl_einheit_werte
          on apflora.tpopkontrzaehl_einheit_werte.code = zaehl5.einheit
          inner join apflora.tpopkontr kontr5
            inner join apflora.tpop tpop5
            on tpop5.id = kontr5.tpop_id
          on zaehl5.tpopkontr_id = kontr5.id
        where
          -- nur Kontrollen mit Jahr berücksichtigen
          kontr5.jahr is not null
          -- nur Zählungen mit Anzahl berücksichtigen
          and zaehl5.anzahl is not null
          and kontr5.id = (
            select
              kontr6.id
            from
              apflora.tpopkontrzaehl zaehl6
              inner join apflora.tpopkontr kontr6
                inner join apflora.tpop tpop6
                on tpop6.id = kontr6.tpop_id
              on zaehl6.tpopkontr_id = kontr6.id
            where
              kontr6.jahr is not null
              and zaehl6.anzahl is not null
              and kontr6.tpop_id = tpop5.id
            order by
              kontr6.jahr desc,
              kontr6.datum desc
            limit 1
          )
        order by
          tpop5.id,
          apflora.tpopkontrzaehl_einheit_werte.text,
          kontr5.jahr desc,
          kontr5.datum desc
      ) as others
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