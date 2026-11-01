-- apber_for_year_data(p_projekt_id, p_jahr, p_apberuebersicht_id): the deep
-- history-tree the ApberForYear print document used to fetch via GraphQL
-- (ap_history by year -> pop_history -> tpop_history -> massnahmen,
-- erfkrits, ziels, apbers). Returns one jsonb in the document's shape:
-- { apberuebersichtById, allAps: { nodes: [...] } }.
BEGIN;

create or replace function apflora.apber_for_year_data(
  p_projekt_id uuid,
  p_jahr integer,
  p_apberuebersicht_id uuid
)
returns jsonb
language sql
stable
security invoker
as $fn$
  with uebersicht as (
    select jsonb_build_object('id', id, 'jahr', jahr, 'bemerkungen', bemerkungen) as obj
    from apflora.apberuebersicht where id = p_apberuebersicht_id
  ),
  aps as (
    select h.id,
      h.bearbeitung,
      h.art_id,
      (
        select jsonb_build_object(
          'taxonomieId', x.taxonomie_id, 'taxonomieName', x.taxonomie_name,
          'id', x.id, 'taxid', x.taxid, 'familie', x.familie,
          'artname', x.artname, 'taxArtName', x.tax_art_name, 'artwert', x.artwert)
        from apflora.ae_taxonomies x where x.id = h.art_id
      ) as ae_taxonomy,
      (
        select coalesce(jsonb_agg(pop_obj order by pop_obj->>'id'), '[]'::jsonb)
        from (
          select jsonb_build_object(
            'id', ph.id,
            'tpopsByPopId', jsonb_build_object('nodes', (
              select coalesce(jsonb_agg(tpop_obj order by tpop_obj->>'id'), '[]'::jsonb)
              from (
                select jsonb_build_object(
                  'id', th.id,
                  'apberRelevant', th.apber_relevant,
                  'tpopmassnsByTpopId', jsonb_build_object('nodes', (
                    select coalesce(jsonb_agg(jsonb_build_object(
                      'id', m.id,
                      'datum', m.datum,
                      'tpopmassnTypWerteByTyp', (
                        select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort, 'historic', w.historic, 'ansiedlung', w.ansiedlung)
                        from apflora.tpopmassn_typ_werte w where w.code = m.typ
                      ),
                      'beschreibung', m.beschreibung,
                      'tpopByTpopId', (
                        select jsonb_build_object(
                          'id', t.id, 'nr', t.nr, 'flurname', t.flurname,
                          'popByPopId', (select jsonb_build_object('id', p.id, 'nr', p.nr, 'name', p.name)
                                          from apflora.pop p where p.id = t.pop_id))
                        from apflora.tpop t where t.id = m.tpop_id
                      )
                      ) order by m.id), '[]'::jsonb)
                    from apflora.tpopmassn m
                    where m.tpop_id = th.id and m.jahr = p_jahr
                  ))
                ) as tpop_obj
                from apflora.tpop_history th
                where th.year = p_jahr
                  and th.pop_id = ph.id
                  and th.apber_relevant = true
                  and th.bekannt_seit <= p_jahr
              ) tpops
            ))
          ) as pop_obj
          from apflora.pop_history ph
          where ph.ap_id = h.id
            and ph.year = p_jahr
            and ph.bekannt_seit <= p_jahr
        ) pops
      ) as pops_json,
      (
        select coalesce(jsonb_agg(jsonb_build_object(
          'id', e.id,
          'kriterien', e.kriterien,
          'apErfkritWerteByErfolg', (
            select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort)
            from apflora.ap_erfkrit_werte w where w.code = e.erfolg
          )
        ) order by e.id), '[]'::jsonb)
        from apflora.erfkrit e where e.ap_id = h.id
      ) as erfkrits_json,
      (
        select coalesce(jsonb_agg(jsonb_build_object(
          'id', z.id, 'apId', z.ap_id, 'jahr', z.jahr, 'typ', z.typ,
          'bezeichnung', z.bezeichnung, 'erreichung', z.erreichung,
          'bemerkungen', z.bemerkungen, 'changedBy', z.changed_by,
          'zielTypWerteByTyp', (
            select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort)
            from apflora.ziel_typ_werte w where w.code = z.typ
          )
        ) order by z.id), '[]'::jsonb)
        from apflora.ziel z where z.ap_id = h.id and z.jahr = p_jahr
      ) as ziels_json,
      (
        select count(*) from apflora.apber a where a.ap_id = h.id and a.jahr = p_jahr
      ) as apbers_count,
      (
        select coalesce(jsonb_agg(jsonb_build_object(
          'id', a.id, 'apId', a.ap_id, 'jahr', a.jahr,
          'situation', a.situation,
          'vergleichVorjahrGesamtziel', a.vergleich_vorjahr_gesamtziel,
          'beurteilung', a.beurteilung,
          'apberAnalyse', a.apber_analyse,
          'konsequenzenUmsetzung', a.konsequenzen_umsetzung,
          'konsequenzenErfolgskontrolle', a.konsequenzen_erfolgskontrolle,
          'biotopeNeue', a.biotope_neue,
          'biotopeOptimieren', a.biotope_optimieren,
          'massnahmenOptimieren', a.massnahmen_optimieren,
          'wirkungAufArt', a.wirkung_auf_art,
          'bearbeiter', a.bearbeiter,
          'datum', a.datum,
          'massnahmenApBearb', a.massnahmen_ap_bearb,
          'massnahmenPlanungVsAusfuehrung', a.massnahmen_planung_vs_ausfuehrung,
          'changedBy', a.changed_by,
          'apErfkritWerteByBeurteilung', (
            select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort)
            from apflora.ap_erfkrit_werte w where w.code = a.beurteilung
          ),
          'adresseByBearbeiter', (
            select jsonb_build_object('id', ad.id, 'name', ad.name, 'email', ad.email, 'adresse', ad.adresse, 'telefon', ad.telefon)
            from apflora.adresse ad where ad.id = a.bearbeiter
          )
        ) order by a.id), '[]'::jsonb)
        from apflora.apber a where a.ap_id = h.id and a.jahr = p_jahr
      ) as apbers_json
    from apflora.ap_history h
    where h.bearbeitung in (1, 2, 3)
      and h.proj_id = p_projekt_id
      and h.year = p_jahr
  )
  select jsonb_build_object(
    'apberuebersichtById', (select obj from uebersicht),
    'allAps', jsonb_build_object('nodes', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', a.id,
        'bearbeitung', a.bearbeitung,
        'aeTaxonomyByArtId', a.ae_taxonomy,
        'popsByApId', jsonb_build_object('nodes', a.pops_json),
        'erfkritsByApId', jsonb_build_object('nodes', a.erfkrits_json),
        'zielsByApId', jsonb_build_object('nodes', a.ziels_json),
        'apbersByApId', jsonb_build_object(
          'totalCount', a.apbers_count,
          'nodes', a.apbers_json
        )
      ) order by a.id), '[]'::jsonb)
      from aps a
    ))
  )
$fn$;

revoke execute on function apflora.apber_for_year_data(uuid, integer, uuid) from public;
grant execute on function apflora.apber_for_year_data(uuid, integer, uuid) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
