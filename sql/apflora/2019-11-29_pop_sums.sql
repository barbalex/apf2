with nr_of_kontr as (
  select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
  from 
    apflora.tpop
    left join apflora.tpopkontr
    on apflora.tpopkontr.tpop_id = apflora.tpop.id
  group by apflora.tpop.id
)
select distinct on (apflora.tpop.id)
  apflora.pop.id as pop_id,
  apflora.tpop.id as tpop_id,
  'Triebe' as zaehleinheit,
  apflora.tpopmassn.anz_triebe as anzahl
from
  apflora.tpopmassn
  inner join apflora.tpop
    inner join nr_of_kontr
    on nr_of_kontr.id = apflora.tpop.id
    inner join apflora.pop
    on apflora.pop.id = apflora.tpop.pop_id
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
union
select distinct on (apflora.tpop.id)
  apflora.pop.id as pop_id,
  apflora.tpop.id as tpop_id,
  'Pflanzen' as zaehleinheit,
  apflora.tpopmassn.anz_pflanzen as anzahl
from
  apflora.tpopmassn
  inner join apflora.tpop
    inner join nr_of_kontr
    on nr_of_kontr.id = apflora.tpop.id
    inner join apflora.pop
    on apflora.pop.id = apflora.tpop.pop_id
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

tpopmassn
anz_triebe > Triebe (3)
anz_pflanzen > Pflanzen (1)
anz_pflanzstellen > Pflanzstellen (70)



with nr_of_kontr as (
  select apflora.tpop.id, count(apflora.tpopkontr.id) as anzahl
  from 
    apflora.tpop
    left join apflora.tpopkontr
    on apflora.tpopkontr.tpop_id = apflora.tpop.id
  group by apflora.tpop.id
)
select
  tpop.id
from
  apflora.tpop tpop
  inner join nr_of_kontr
  on nr_of_kontr.id = tpop.id
where
  status in (200, 201)
  and nr_of_kontr.anzahl = 0


-- get sums per pop
with tpop_sums as (
  select distinct on (apflora.tpop.id, apflora.tpopkontrzaehl_einheit_werte.text)
    apflora.pop.id as pop_id,
    apflora.tpop.id as tpop_id,
    apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
    apflora.tpopkontrzaehl.anzahl as anzahl
  from
    apflora.tpopkontrzaehl
    inner join apflora.tpopkontrzaehl_einheit_werte
    on apflora.tpopkontrzaehl_einheit_werte.code = apflora.tpopkontrzaehl.einheit
    inner join apflora.tpopkontr
      inner join apflora.tpop
        inner join apflora.pop
        on apflora.pop.id = apflora.tpop.pop_id
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
)
select pop_id, zaehleinheit, sum(anzahl) as anzahl
from tpop_sums
group by pop_id, zaehleinheit



-- get einheiten
select text from apflora.tpopkontrzaehl_einheit_werte order by sort, text;

-- direct
select 
  tax.artname,
  pop.nr as pop_nr,
  anzahl.*
from crosstab($$
  select pop_id, zaehleinheit, anzahl
  from 
    (with tpop_sums as (
      select distinct on (apflora.tpop.id, apflora.tpopkontrzaehl_einheit_werte.text)
        apflora.pop.id as pop_id,
        apflora.tpop.id as tpop_id,
        apflora.tpopkontrzaehl_einheit_werte.text as zaehleinheit,
        apflora.tpopkontrzaehl.anzahl as anzahl
      from
        apflora.tpopkontrzaehl
        inner join apflora.tpopkontrzaehl_einheit_werte
        on apflora.tpopkontrzaehl_einheit_werte.code = apflora.tpopkontrzaehl.einheit
        inner join apflora.tpopkontr
          inner join apflora.tpop
            inner join apflora.pop
            on apflora.pop.id = apflora.tpop.pop_id
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
    )
    select pop_id, zaehleinheit, sum(anzahl) as anzahl
    from tpop_sums
    group by pop_id, zaehleinheit) as tbl
  order by 1,2,3
  $$,
  $$SELECT unnest('{Pflanzen, Pflanzen (ohne Jungpflanzen), Triebe, Triebe Beweidung, Keimlinge, Rosetten, Jungpflanzen, Blätter, blühende Pflanzen, blühende Triebe, Blüten, Fertile Pflanzen, fruchtende Triebe, Blütenstände, Fruchtstände, Gruppen, Deckung (%), Pflanzen/5m2, Triebe in 30 m2, Triebe/50m2, Triebe Mähfläche, Fläche (m2), Pflanzstellen, Stellen, andere Zaehleinheit, Art ist vorhanden}'::text[])$$
) as anzahl ("pop_id" uuid, "Pflanzen" text, "Pflanzen (ohne Jungpflanzen)" text, "Triebe" text, "Triebe Beweidung" text, "Keimlinge" text, "Rosetten" text, "Jungpflanzen" text, "Blätter" text, "blühende Pflanzen" text, "blühende Triebe" text, "Blüten" text, "Fertile Pflanzen" text, "fruchtende Triebe" text, "Blütenstände" text, "Fruchtstände" text, "Gruppen" text, "Deckung (%)" text, "Pflanzen/5m2" text, "Triebe in 30 m2" text, "Triebe/50m2" text, "Triebe Mähfläche" text, "Fläche (m2)" text, "Pflanzstellen" text, "Stellen" text, "andere Zaehleinheit" text, "Art ist vorhanden" text)
inner join apflora.pop pop
  inner join apflora.ap
    inner join apflora.ae_taxonomies tax
    on ap.art_id = tax.id
  on apflora.ap.id = pop.ap_id
on pop.id = anzahl.pop_id
order BY
  tax.artname,
  pop.nr;