-- apber_for_ap_from_ap(p_ap_id, p_jahr): the history-tree the
-- ApberForApFromAp print document used to fetch via GraphQL.
-- Returns jsonb in the document's shape:
-- { apById, jberAbcByApId: { nodes } }.
BEGIN;

create or replace function apflora.apber_for_ap_from_ap(
  p_ap_id uuid,
  p_jahr integer
)
returns jsonb
language sql
stable
security invoker
as $fn$
  with ap_row as (
    select h.id, h.bearbeitung, h.art_id
    from apflora.ap_history h
    where h.id = p_ap_id and h.year = p_jahr
  ),
  ap_json as (
    select jsonb_build_object(
      'id', a.id,
      'bearbeitung', a.bearbeitung,
      'aeTaxonomyByArtId', (
        select jsonb_build_object(
          'taxonomieId', x.taxonomie_id, 'taxonomieName', x.taxonomie_name,
          'id', x.id, 'taxid', x.taxid, 'familie', x.familie,
          'artname', x.artname, 'taxArtName', x.tax_art_name, 'artwert', x.artwert)
        from apflora.ae_taxonomies x where x.id = a.art_id
      ),
      'popsByApId', jsonb_build_object('nodes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', ph.id,
          'tpopsByPopId', jsonb_build_object('nodes', coalesce((
            select jsonb_agg(jsonb_build_object(
              'id', th.id,
              'apberRelevant', th.apber_relevant,
              'firstTpopmassn', jsonb_build_object('nodes', coalesce((
                select jsonb_agg(jsonb_build_object('id', m.id, 'datum', m.datum))
                from (
                  select m.id, m.datum
                  from apflora.tpopmassn m
                  where m.tpop_id = th.id
                  order by m.datum asc nulls last, m.id
                  limit 1
                ) m
              ), '[]'::jsonb)),
              'tpopmassnsByTpopId', jsonb_build_object('nodes', coalesce((
                select jsonb_agg(jsonb_build_object(
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
                ) order by m.id)
                from apflora.tpopmassn m
                where m.tpop_id = th.id and m.jahr = p_jahr
              ), '[]'::jsonb)),
              'firstTpopber', jsonb_build_object('nodes', coalesce((
                select jsonb_agg(jsonb_build_object(
                  'id', b.id, 'tpopId', b.tpop_id, 'jahr', b.jahr,
                  'entwicklung', b.entwicklung,
                  'bemerkungen', b.bemerkungen, 'changedBy', b.changed_by
                ))
                from (
                  select b.id, b.tpop_id, b.jahr, b.entwicklung, b.bemerkungen, b.changed_by
                  from apflora.tpopber b
                  where b.tpop_id = th.id
                  order by b.jahr asc nulls last, b.id
                  limit 1
                ) b
              ), '[]'::jsonb))
            ) order by th.id)
            from apflora.tpop_history th
            where th.year = p_jahr
              and th.pop_id = ph.id
              and th.apber_relevant = true
          ), '[]'::jsonb))
        ) order by ph.id)
        from apflora.pop_history ph
        where ph.ap_id = a.id and ph.year = p_jahr
      ), '[]'::jsonb)),
      'erfkritsByApId', jsonb_build_object('nodes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id,
          'kriterien', e.kriterien,
          'apErfkritWerteByErfolg', (
            select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort)
            from apflora.ap_erfkrit_werte w where w.code = e.erfolg
          )
        ) order by e.id)
        from apflora.erfkrit e where e.ap_id = a.id
      ), '[]'::jsonb)),
      'zielsByApId', jsonb_build_object('nodes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', z.id, 'apId', z.ap_id, 'jahr', z.jahr, 'typ', z.typ,
          'bezeichnung', z.bezeichnung, 'erreichung', z.erreichung,
          'bemerkungen', z.bemerkungen, 'changedBy', z.changed_by,
          'zielTypWerteByTyp', (
            select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort)
            from apflora.ziel_typ_werte w where w.code = z.typ
          )
        ) order by z.id)
        from apflora.ziel z where z.ap_id = a.id and z.jahr = p_jahr
      ), '[]'::jsonb)),
      'apbersByApId', jsonb_build_object('nodes', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', b.id, 'apId', b.ap_id, 'jahr', b.jahr,
          'situation', b.situation,
          'vergleichVorjahrGesamtziel', b.vergleich_vorjahr_gesamtziel,
          'beurteilung', b.beurteilung,
          'apberAnalyse', b.apber_analyse,
          'konsequenzenUmsetzung', b.konsequenzen_umsetzung,
          'konsequenzenErfolgskontrolle', b.konsequenzen_erfolgskontrolle,
          'biotopeNeue', b.biotope_neue,
          'biotopeOptimieren', b.biotope_optimieren,
          'massnahmenOptimieren', b.massnahmen_optimieren,
          'wirkungAufArt', b.wirkung_auf_art,
          'bearbeiter', b.bearbeiter,
          'datum', b.datum,
          'massnahmenApBearb', b.massnahmen_ap_bearb,
          'massnahmenPlanungVsAusfuehrung', b.massnahmen_planung_vs_ausfuehrung,
          'changedBy', b.changed_by,
          'apErfkritWerteByBeurteilung', (
            select jsonb_build_object('id', w.code, 'code', w.code, 'text', w.text, 'sort', w.sort)
            from apflora.ap_erfkrit_werte w where w.code = b.beurteilung
          ),
          'adresseByBearbeiter', (
            select jsonb_build_object('id', ad.id, 'name', ad.name, 'email', ad.email, 'adresse', ad.adresse, 'telefon', ad.telefon)
            from apflora.adresse ad where ad.id = b.bearbeiter
          )
        ) order by b.id)
        from apflora.apber b where b.ap_id = a.id and b.jahr = p_jahr
      ), '[]'::jsonb))
    ) as obj
    from ap_row a
  )
  select jsonb_build_object(
    'apById', (select obj from ap_json),
    'jberAbcByApId', jsonb_build_object('nodes', coalesce((
      select array_to_json(array(
        select j from apflora.jber_abc(p_jahr) j where j.id = p_ap_id
      ))::jsonb
    ), '[]'::jsonb))
  )
$fn$;

revoke execute on function apflora.apber_for_ap_from_ap(uuid, integer) from public;
grant execute on function apflora.apber_for_ap_from_ap(uuid, integer) to
  apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
