select 
  tax.artname,
  ap.id as ap_id,
  pop.id as pop_id,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  (
    select
      kontr4.jahr
    from
      apflora.tpopkontrzaehl zaehl3
      inner join apflora.tpopkontr kontr4
        inner join apflora.tpop tpop3
        on tpop3.id = kontr4.tpop_id
      on zaehl3.tpopkontr_id = kontr4.id
    where
      kontr4.jahr is not null
      and zaehl3.anzahl is not null
      and kontr4.tpop_id = tpop.id
    order by
      kontr4.jahr desc,
      kontr4.datum desc
    limit 1
  ) as jahr,
  anzahl.*
from crosstab($$
  select tpop_id, zaehleinheit, anzahl
  from (
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