select
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  t.tpop_id,
  t.id,
  (
    select count(*)
    from (values (t.lr_delarze)) as v(col)
    where v.col is not null
  ) as lr_delarze,
  (
    select count(*)
    from (values (t.lr_umgebung_delarze)) as v(col)
    where v.col is not null
  ) as lr_umgebung_delarze,
  (
    select count(*)
    from (values (t.vegetationstyp)) as v(col)
    where v.col is not null
  ) as vegetationstyp,
  (
    select count(*)
    from (values (t.konkurrenz)) as v(col)
    where v.col is not null
  ) as konkurrenz,
  (
    select count(*)
    from (values (t.moosschicht)) as v(col)
    where v.col is not null
  ) as moosschicht,
  (
    select count(*)
    from (values (t.krautschicht)) as v(col)
    where v.col is not null
  ) as krautschicht,
  (
    select count(*)
    from (values (t.strauchschicht)) as v(col)
    where v.col is not null
  ) as strauchschicht,
  (
    select count(*)
    from (values (t.baumschicht)) as v(col)
    where v.col is not null
  ) as baumschicht,
  (
    select count(*)
    from (values (t.boden_typ)) as v(col)
    where v.col is not null
  ) as boden_typ,
  (
    select count(*)
    from (values (t.boden_kalkgehalt)) as v(col)
    where v.col is not null
  ) as boden_kalkgehalt,
  (
    select count(*)
    from (values (t.boden_durchlaessigkeit)) as v(col)
    where v.col is not null
  ) as boden_durchlaessigkeit,
  (
    select count(*)
    from (values (t.boden_humus)) as v(col)
    where v.col is not null
  ) as boden_humus,
  (
    select count(*)
    from (values (t.boden_naehrstoffgehalt)) as v(col)
    where v.col is not null
  ) as boden_naehrstoffgehalt,
  (
    select count(*)
    from (values (t.boden_abtrag)) as v(col)
    where v.col is not null
  ) as boden_abtrag,
  (
    select count(*)
    from (values (t.wasserhaushalt)) as v(col)
    where v.col is not null
  ) as wasserhaushalt,
  (
    select count(*)
    from (values (t.idealbiotop_uebereinstimmung::text)) as v(col)
    where v.col is not null
  ) as idealbiotop_uebereinstimmung,
  (
    select count(*)
    from (values (t.handlungsbedarf)) as v(col)
    where v.col is not null
  ) as handlungsbedarf,
  (
    select count(*)
    from (values (t.flaeche::text)) as v(col)
    where v.col is not null
  ) as flaeche,
  (
    select count(*)
    from (values (t.lr_delarze), (t.lr_umgebung_delarze), (t.vegetationstyp), (t.konkurrenz), (t.moosschicht), (t.krautschicht), (t.strauchschicht), (t.baumschicht), (t.boden_typ), (t.boden_kalkgehalt), (t.boden_durchlaessigkeit), (t.boden_humus), (t.boden_naehrstoffgehalt), (t.boden_abtrag), (t.wasserhaushalt), (t.idealbiotop_uebereinstimmung::text), (t.handlungsbedarf), (t.flaeche::text)) as v(col)
    where v.col is not null
  ) as gruppe_biotop,
  (
    select count(*)
    from (values (t.lr_delarze), (t.lr_umgebung_delarze), (t.vegetationstyp)) as v(col)
    where v.col is not null
  ) as gruppe_vegetationstyp,
  (
    select count(*)
    from (values (t.boden_typ), (t.boden_kalkgehalt), (t.boden_durchlaessigkeit), (t.boden_humus), (t.boden_naehrstoffgehalt), (t.boden_abtrag), (t.wasserhaushalt)) as v(col)
    where v.col is not null
  ) as gruppe_boden,
  (
    select count(*)
    from (values (t.konkurrenz), (t.moosschicht), (t.krautschicht), (t.strauchschicht), (t.baumschicht), (t.idealbiotop_uebereinstimmung::text), (t.handlungsbedarf)) as v(col)
    where v.col is not null
  ) as gruppe_entwicklung
from 
  apflora.tpopkontr as t
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = t.tpop_id
where 
  t.typ <> 'Freiwilligen-Erfolgskontrolle'
  and tax.taxid > 150
order by
  tax.artname,
  pop.nr,
  tpop.nr;












with ek_analysis as (
  select
  t.id,
  t.tpop_id,
  (
    select count(*)
    from (values (t.lr_delarze)) as v(col)
    where v.col is not null
  ) as lr_delarze,
  (
    select count(*)
    from (values (t.lr_umgebung_delarze)) as v(col)
    where v.col is not null
  ) as lr_umgebung_delarze,
  (
    select count(*)
    from (values (t.vegetationstyp)) as v(col)
    where v.col is not null
  ) as vegetationstyp,
  (
    select count(*)
    from (values (t.konkurrenz)) as v(col)
    where v.col is not null
  ) as konkurrenz,
  (
    select count(*)
    from (values (t.moosschicht)) as v(col)
    where v.col is not null
  ) as moosschicht,
  (
    select count(*)
    from (values (t.krautschicht)) as v(col)
    where v.col is not null
  ) as krautschicht,
  (
    select count(*)
    from (values (t.strauchschicht)) as v(col)
    where v.col is not null
  ) as strauchschicht,
  (
    select count(*)
    from (values (t.baumschicht)) as v(col)
    where v.col is not null
  ) as baumschicht,
  (
    select count(*)
    from (values (t.boden_typ)) as v(col)
    where v.col is not null
  ) as boden_typ,
  (
    select count(*)
    from (values (t.boden_kalkgehalt)) as v(col)
    where v.col is not null
  ) as boden_kalkgehalt,
  (
    select count(*)
    from (values (t.boden_durchlaessigkeit)) as v(col)
    where v.col is not null
  ) as boden_durchlaessigkeit,
  (
    select count(*)
    from (values (t.boden_humus)) as v(col)
    where v.col is not null
  ) as boden_humus,
  (
    select count(*)
    from (values (t.boden_naehrstoffgehalt)) as v(col)
    where v.col is not null
  ) as boden_naehrstoffgehalt,
  (
    select count(*)
    from (values (t.boden_abtrag)) as v(col)
    where v.col is not null
  ) as boden_abtrag,
  (
    select count(*)
    from (values (t.wasserhaushalt)) as v(col)
    where v.col is not null
  ) as wasserhaushalt,
  (
    select count(*)
    from (values (t.idealbiotop_uebereinstimmung::text)) as v(col)
    where v.col is not null
  ) as idealbiotop_uebereinstimmung,
  (
    select count(*)
    from (values (t.handlungsbedarf)) as v(col)
    where v.col is not null
  ) as handlungsbedarf,
  (
    select count(*)
    from (values (t.flaeche::text)) as v(col)
    where v.col is not null
  ) as flaeche,
  (
    case
      when (
        select count(*)
        from (values (t.lr_delarze), (t.lr_umgebung_delarze), (t.vegetationstyp), (t.konkurrenz), (t.moosschicht), (t.krautschicht), (t.strauchschicht), (t.baumschicht), (t.boden_typ), (t.boden_kalkgehalt), (t.boden_durchlaessigkeit), (t.boden_humus), (t.boden_naehrstoffgehalt), (t.boden_abtrag), (t.wasserhaushalt), (t.idealbiotop_uebereinstimmung::text), (t.handlungsbedarf), (t.flaeche::text)) as v(col)
        where v.col is not null
      ) > 0 then 1
      else 0
    end
  ) as gruppe_biotop,
  (
    case
      when (
        select count(*)
        from (values (t.lr_delarze), (t.lr_umgebung_delarze), (t.vegetationstyp)) as v(col)
        where v.col is not null
      ) > 0 then 1
      else 0
    end
  ) as gruppe_vegetationstyp,
  (
    case
      when (
        select count(*)
        from (values (t.boden_typ), (t.boden_kalkgehalt), (t.boden_durchlaessigkeit), (t.boden_humus), (t.boden_naehrstoffgehalt), (t.boden_abtrag), (t.wasserhaushalt)) as v(col)
        where v.col is not null
      ) > 0 then 1
      else 0
    end
  ) as gruppe_boden,
  (
    case
      when (
        select count(*)
        from (values (t.konkurrenz), (t.moosschicht), (t.krautschicht), (t.strauchschicht), (t.baumschicht), (t.idealbiotop_uebereinstimmung::text), (t.handlungsbedarf)) as v(col)
        where v.col is not null
      ) > 0 then 1
      else 0
    end
  ) as gruppe_entwicklung
from 
  apflora.tpopkontr as t
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = t.tpop_id
where 
  t.typ <> 'Freiwilligen-Erfolgskontrolle'
  and tax.taxid > 150
)
select
  tax.artname,
  pop.nr as pop_nr,
  tpop.nr as tpop_nr,
  tpop.id as tpop_id,
  count(eka.id) as ek_count,
  sum(eka.lr_delarze) as lr_delarze_count,
  sum(eka.lr_umgebung_delarze) as lr_umgebung_delarze_count,
  sum(eka.vegetationstyp) as vegetationstyp_count,
  sum(eka.konkurrenz) as konkurrenz_count,
  sum(eka.moosschicht) as moosschicht_count,
  sum(eka.krautschicht) as krautschicht_count,
  sum(eka.strauchschicht) as strauchschicht_count,
  sum(eka.baumschicht) as baumschicht_count,
  sum(eka.boden_typ) as boden_typ_count,
  sum(eka.boden_kalkgehalt) as boden_kalkgehalt_count,
  sum(eka.boden_durchlaessigkeit) as boden_durchlaessigkeit_count,
  sum(eka.boden_humus) as boden_humus_count,
  sum(eka.boden_naehrstoffgehalt) as boden_naehrstoffgehalt_count,
  sum(eka.boden_abtrag) as boden_abtrag_count,
  sum(eka.wasserhaushalt) as wasserhaushalt_count,
  sum(eka.idealbiotop_uebereinstimmung) as idealbiotop_uebereinstimmung_count,
  sum(eka.handlungsbedarf) as handlungsbedarf_count,
  sum(eka.flaeche) as flaeche_count,
  sum(eka.gruppe_biotop) as gruppe_biotop_count,
  sum(eka.gruppe_vegetationstyp) as gruppe_vegetationstyp_count,
  sum(eka.gruppe_boden) as gruppe_boden_count,
  sum(eka.gruppe_entwicklung) as gruppe_entwicklung_count
from 
  ek_analysis as eka
  inner join apflora.tpop tpop
    inner join apflora.pop pop
      inner join apflora.ap ap
        inner join apflora.ae_taxonomies tax
        on tax.id = ap.art_id
      on ap.id = pop.ap_id
    on pop.id = tpop.pop_id
  on tpop.id = eka.tpop_id
where 
  tax.taxid > 150
group by 
  tax.artname,
  pop.nr,
  tpop.nr,
  tpop.id
order by
  tax.artname,
  pop.nr,
  tpop.nr;
