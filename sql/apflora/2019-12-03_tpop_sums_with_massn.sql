with nr_of_kontr as (
  select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
  from 
    apflora.tpop
    left join apflora.tpopkontr
    on apflora.tpopkontr.tpop_id = apflora.tpop.id
  group by apflora.tpop.id
)
select * from (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id as tpop_id,
    'Triebe' as zaehleinheit,
    apflora.tpopmassn.anz_triebe as anzahl
  from
    apflora.tpopmassn
    inner join apflora.tpop
      inner join nr_of_kontr
      on nr_of_kontr.id = apflora.tpop.id
    on apflora.tpop.id = apflora.tpopmassn.tpop_id
  where
    apflora.tpopmassn.jahr is not null
    and apflora.tpop.status in (200, 201)
    and nr_of_kontr.anzahl = 0
    and apflora.tpopmassn.anz_triebe is not null
  order by
    apflora.tpop.id,
    apflora.tpopmassn.jahr desc,
    apflora.tpopmassn.datum desc
) as triebe
union
select * from (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id as tpop_id,
    'Pflanzen' as zaehleinheit,
    apflora.tpopmassn.anz_pflanzen as anzahl
  from
    apflora.tpopmassn
    inner join apflora.tpop
      inner join nr_of_kontr
      on nr_of_kontr.id = apflora.tpop.id
    on apflora.tpop.id = apflora.tpopmassn.tpop_id
  where
    apflora.tpopmassn.jahr is not null
    and apflora.tpop.status in (200, 201)
    and nr_of_kontr.anzahl = 0
    and apflora.tpopmassn.anz_pflanzen is not null
  order by
    apflora.tpop.id,
    apflora.tpopmassn.jahr desc,
    apflora.tpopmassn.datum desc
) as pflanzen
union
select * from (
  select distinct on (apflora.tpop.id)
    apflora.tpop.id as tpop_id,
    'Pflanzstellen' as zaehleinheit,
    apflora.tpopmassn.anz_pflanzstellen as anzahl
  from
    apflora.tpopmassn
    inner join apflora.tpop
      inner join nr_of_kontr
      on nr_of_kontr.id = apflora.tpop.id
    on apflora.tpop.id = apflora.tpopmassn.tpop_id
  where
    apflora.tpopmassn.jahr is not null
    and apflora.tpop.status in (200, 201)
    and nr_of_kontr.anzahl = 0
    and apflora.tpopmassn.anz_pflanzstellen is not null
  order by
    apflora.tpop.id,
    apflora.tpopmassn.jahr desc,
    apflora.tpopmassn.datum desc
) as pflanzstellen
union
select * from (
  select distinct on (apflora.tpop.id, apflora.tpopkontrzaehl_einheit_werte.text)
      apflora.tpop.id as tpop_id,
      apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
      apflora.tpopkontrzaehl.anzahl as anzahl
    from
      apflora.tpopkontrzaehl
      inner join apflora.tpopkontrzaehl_einheit_werte
      on apflora.tpopkontrzaehl_einheit_werte.code = apflora.tpopkontrzaehl.einheit
      inner join apflora.tpopkontr
        inner join apflora.tpop
        on apflora.tpop.id = apflora.tpopkontr.tpop_id
      on apflora.tpopkontrzaehl.tpopkontr_id = apflora.tpopkontr.id
    where
      -- nur Kontrollen mit Jahr berücksichtigen
      apflora.tpopkontr.jahr is not null
      -- nur Zählungen mit Anzahl berücksichtigen
      and apflora.tpopkontrzaehl.anzahl is not null
    order by
      apflora.tpop.id,
      apflora.tpopkontrzaehl_einheit_werte.text,
      apflora.tpopkontr.jahr desc,
      apflora.tpopkontr.datum desc
) as others


-- crosstab
select 
  tax.artname,
  ap.id as ap_id,
  pop.nr as pop_nr,
  pop.id as pop_id,
  tpop.nr as tpop_nr,
  anzahl.*
from crosstab($$
  select tpop_id, zaehleinheit, anzahl
  from 
    (
      with nr_of_kontr as (
        select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
        from 
          apflora.tpop
          left join apflora.tpopkontr
          on apflora.tpopkontr.tpop_id = apflora.tpop.id
        group by apflora.tpop.id
      )
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.tpop.id as tpop_id,
          'Triebe' as zaehleinheit,
          apflora.tpopmassn.anz_triebe as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_triebe is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as triebe
      union
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.tpop.id as tpop_id,
          'Pflanzen' as zaehleinheit,
          apflora.tpopmassn.anz_pflanzen as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_pflanzen is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as pflanzen
      union
      select * from (
        select distinct on (apflora.tpop.id)
          apflora.tpop.id as tpop_id,
          'Pflanzstellen' as zaehleinheit,
          apflora.tpopmassn.anz_pflanzstellen as anzahl
        from
          apflora.tpopmassn
          inner join apflora.tpop
            inner join nr_of_kontr
            on nr_of_kontr.id = apflora.tpop.id
          on apflora.tpop.id = apflora.tpopmassn.tpop_id
        where
          apflora.tpopmassn.jahr is not null
          and apflora.tpop.status in (200, 201)
          and nr_of_kontr.anzahl = 0
          and apflora.tpopmassn.anz_pflanzstellen is not null
        order by
          apflora.tpop.id,
          apflora.tpopmassn.jahr desc,
          apflora.tpopmassn.datum desc
      ) as pflanzstellen
      union
      select * from (
        select distinct on (tpop2.id, apflora.tpopkontrzaehl_einheit_werte.text)
          tpop2.id as tpop_id,
          apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
          zaehl2.anzahl
        from
          apflora.tpopkontrzaehl zaehl2
          inner join apflora.tpopkontrzaehl_einheit_werte
          on apflora.tpopkontrzaehl_einheit_werte.code = zaehl2.einheit
          inner join apflora.tpopkontr kontr2
            inner join apflora.tpop tpop2
            on tpop2.id = kontr2.tpop_id
          on zaehl2.tpopkontr_id = kontr2.id
        where
          -- nur Kontrollen mit Jahr berücksichtigen
          kontr2.jahr is not null
          -- nur Zählungen mit Anzahl berücksichtigen
          and zaehl2.anzahl is not null
          and kontr2.id = (
            select
              kontr3.id
            from
              apflora.tpopkontrzaehl zaehl3
              inner join apflora.tpopkontr kontr3
                inner join apflora.tpop tpop3
                on tpop3.id = kontr3.tpop_id
              on zaehl3.tpopkontr_id = kontr3.id
            where
              kontr3.jahr is not null
              and zaehl3.anzahl is not null
              and kontr3.tpop_id = tpop2.id
            order by
              kontr3.jahr desc,
              kontr3.datum desc
            limit 1
          )
        order by
          tpop2.id,
          apflora.tpopkontrzaehl_einheit_werte.text,
          kontr2.jahr desc,
          kontr2.datum desc
      ) as others
    ) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("tpop_id" uuid, "Pflanzen" text, "Pflanzen (ohne Jungpflanzen)" text, "Triebe" text, "Triebe Beweidung" text, "Keimlinge" text, "Rosetten" text, "Jungpflanzen" text, "Blätter" text, "blühende Pflanzen" text, "blühende Triebe" text, "Blüten" text, "Fertile Pflanzen" text, "fruchtende Triebe" text, "Blütenstände" text, "Fruchtstände" text, "Gruppen" text, "Deckung (%)" text, "Pflanzen/5m2" text, "Triebe in 30 m2" text, "Triebe/50m2" text, "Triebe Mähfläche" text, "Fläche (m2)" text, "Pflanzstellen" text, "Stellen" text, "andere Zaehleinheit" text, "Art ist vorhanden" text)
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