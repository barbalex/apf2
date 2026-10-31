-- v_<table> views: base table plus the computed columns the client
-- selects (label, coordinate transforms). PostgREST cannot call
-- functions per row, so reads go through these views.
-- security_invoker keeps the RLS policies of the base tables applied.
-- Regenerate after schema changes; apply like the other files in sql/.
-- camelCase keys are restored at the edge via select aliases
-- (see src/modules/selects.ts).
BEGIN;

CREATE OR REPLACE VIEW apflora.v_adresse WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.adresse_label(t) AS label
  FROM apflora.adresse t;
GRANT SELECT ON apflora.v_adresse TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;


CREATE OR REPLACE VIEW apflora.v_ap WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ap_label(t) AS label,
    (SELECT jsonb_build_object(
        'taxonomieId', x.taxonomie_id, 'taxonomieName', x.taxonomie_name,
        'id', x.id, 'taxid', x.taxid, 'familie', x.familie,
        'artname', x.artname, 'taxArtName', x.tax_art_name,
        'artwert', x.artwert)
      FROM apflora.ae_taxonomies x WHERE x.id = t.art_id) AS ae_taxonomy_by_art_id,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.ap_bearbstand_werte w WHERE w.code = t.bearbeitung)
      AS ap_bearbstand_werte_by_bearbeitung,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.ap_umsetzung_werte w WHERE w.code = t.umsetzung)
      AS ap_umsetzung_werte_by_umsetzung,
    (SELECT jsonb_build_object('id', ad.id, 'name', ad.name)
      FROM apflora.adresse ad WHERE ad.id = t.bearbeiter)
      AS adresse_by_bearbeiter,
    (SELECT jsonb_build_object('id', pr.id, 'name', pr.name)
      FROM apflora.projekt pr WHERE pr.id = t.proj_id)
      AS projekt_by_proj_id
  FROM apflora.ap t;
GRANT SELECT ON apflora.v_ap TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_apart WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.apart_label(t) AS label,
    (SELECT jsonb_build_object('id', x.id, 'taxArtName', x.tax_art_name)
      FROM apflora.ae_taxonomies x WHERE x.id = t.art_id) AS ae_taxonomy_by_art_id,
    (SELECT jsonb_build_object('id', a.id, 'apartsByApId', jsonb_build_object('nodes',
        (SELECT coalesce(jsonb_agg(jsonb_build_object(
          'id', c.id, 'apId', c.ap_id, 'artId', c.art_id,
          'changedBy', c.changed_by,
          'label', apflora.apart_label(c)) ORDER BY c.art_id), '[]'::jsonb)
          FROM apflora.apart c WHERE c.ap_id = a.id)))
      FROM apflora.ap a WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.apart t;
GRANT SELECT ON apflora.v_apart TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_apber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.apber_label(t) AS label,
    (SELECT jsonb_build_object('id', a.id, 'apbersByApId', jsonb_build_object('nodes',
        (SELECT coalesce(jsonb_agg(jsonb_build_object(
          'jahr', c.jahr, 'beurteilung', c.beurteilung) ORDER BY c.jahr), '[]'::jsonb)
          FROM apflora.apber c WHERE c.ap_id = a.id)))
      FROM apflora.ap a WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.apber t;
GRANT SELECT ON apflora.v_apber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_apberuebersicht WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.apberuebersicht_label(t) AS label
  FROM apflora.apberuebersicht t;
GRANT SELECT ON apflora.v_apberuebersicht TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_assozart WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.assozart_label(t) AS label,
    (SELECT jsonb_build_object('id', x.id, 'taxArtName', x.tax_art_name)
      FROM apflora.ae_taxonomies x WHERE x.id = t.ae_id) AS ae_taxonomy_by_ae_id,
    (SELECT jsonb_build_object('artId', a.art_id, 'assozartsByApId', jsonb_build_object('nodes',
        (SELECT coalesce(jsonb_agg(jsonb_build_object(
          'id', c.id, 'apId', c.ap_id, 'aeId', c.ae_id,
          'changedBy', c.changed_by,
          'label', apflora.assozart_label(c)) ORDER BY c.ae_id), '[]'::jsonb)
          FROM apflora.assozart c WHERE c.ap_id = a.id)))
      FROM apflora.ap a WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.assozart t;
GRANT SELECT ON apflora.v_assozart TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_beob WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.beob_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  FROM apflora.beob t;
GRANT SELECT ON apflora.v_beob TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_currentissue WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.currentissue_label(t) AS label
  FROM apflora.currentissue t;
GRANT SELECT ON apflora.v_currentissue TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ek_abrechnungstyp_werte WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ek_abrechnungstyp_werte_label(t) AS label
  FROM apflora.ek_abrechnungstyp_werte t;
GRANT SELECT ON apflora.v_ek_abrechnungstyp_werte TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ekzaehleinheit WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ekzaehleinheit_label(t) AS label,
    (SELECT jsonb_build_object('id', w.id, 'code', w.code, 'text', w.text,
        'label', apflora.tpopkontrzaehl_einheit_werte_label(w),
        'sort', w.sort, 'historic', w.historic)
      FROM apflora.tpopkontrzaehl_einheit_werte w
      WHERE w.id = t.zaehleinheit_id) AS tpopkontrzaehl_einheit_werte_by_zaehleinheit_id,
    (SELECT jsonb_build_object('id', a.id, 'ekzaehleinheitsByApId', jsonb_build_object('nodes',
        (SELECT coalesce(jsonb_agg(jsonb_build_object(
          'id', c.id, 'apId', c.ap_id, 'zaehleinheitId', c.zaehleinheit_id,
          'zielrelevant', c.zielrelevant,
          'notMassnCountUnit', c.not_massn_count_unit,
          'sort', c.sort, 'bemerkungen', c.bemerkungen,
          'changedBy', c.changed_by,
          'label', apflora.ekzaehleinheit_label(c)) ORDER BY c.sort), '[]'::jsonb)
          FROM apflora.ekzaehleinheit c WHERE c.ap_id = a.id)))
      FROM apflora.ap a WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.ekzaehleinheit t;
GRANT SELECT ON apflora.v_ekzaehleinheit TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_erfkrit WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.erfkrit_label(t) AS label
  FROM apflora.erfkrit t;
GRANT SELECT ON apflora.v_erfkrit TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_pop WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.pop_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long,
    -- jsonb relation columns: PostgREST cannot embed through views
    -- (no foreign keys), so the relations the forms read are exposed
    -- directly, in the camelCase shape the client types expect
    (SELECT jsonb_build_object('id', a.id, 'startJahr', a.start_jahr)
      FROM apflora.ap a WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.pop t;
GRANT SELECT ON apflora.v_pop TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_popber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.popber_label(t) AS label,
    (SELECT jsonb_build_object('id', w.id, 'code', w.code, 'text', w.text, 'sort', w.sort, 'historic', w.historic)
      FROM apflora.tpop_entwicklung_werte w WHERE w.code = t.entwicklung)
      AS tpop_entwicklung_werte_by_entwicklung,
    (SELECT jsonb_build_object('id', p.id, 'apId', p.ap_id, 'nr', p.nr,
        'name', p.name, 'status', p.status, 'bekanntSeit', p.bekannt_seit,
        'label', apflora.pop_label(p), 'statusUnklar', p.status_unklar,
        'statusUnklarBegruendung', p.status_unklar_begruendung)
      FROM apflora.pop p WHERE p.id = t.pop_id) AS pop_by_pop_id
  FROM apflora.popber t;
GRANT SELECT ON apflora.v_popber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_popmassnber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.popmassnber_label(t) AS label,
    (SELECT jsonb_build_object('id', w.id, 'code', w.code, 'text', w.text, 'sort', w.sort, 'historic', w.historic)
      FROM apflora.tpopmassn_erfbeurt_werte w WHERE w.code = t.beurteilung)
      AS tpopmassn_erfbeurt_werte_by_beurteilung,
    (SELECT jsonb_build_object('id', p.id, 'apId', p.ap_id)
      FROM apflora.pop p WHERE p.id = t.pop_id) AS pop_by_pop_id
  FROM apflora.popmassnber t;
GRANT SELECT ON apflora.v_popmassnber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_projekt WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.projekt_label(t) AS label
  FROM apflora.projekt t;
GRANT SELECT ON apflora.v_projekt TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpop WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpop_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long,
    -- jsonb relation columns; camelCase keys match the client types
    (SELECT jsonb_build_object('id', w.id, 'code', w.code, 'text', w.text,
        'sort', w.sort, 'historic', w.historic)
      FROM apflora.pop_status_werte w WHERE w.code = t.status)
      AS pop_status_werte_by_status,
    (SELECT jsonb_build_object('id', w.id, 'code', w.code, 'text', w.text,
        'sort', w.sort, 'historic', w.historic)
      FROM apflora.tpop_apberrelevant_grund_werte w
      WHERE w.code = t.apber_relevant_grund)
      AS tpop_apberrelevant_grund_werte_by_apber_relevant_grund,
    (SELECT jsonb_build_object('id', p.id, 'apId', p.ap_id,
        'apByApId', jsonb_build_object('id', a.id, 'startJahr', a.start_jahr))
      FROM apflora.pop p JOIN apflora.ap a ON a.id = p.ap_id
      WHERE p.id = t.pop_id)
      AS pop_by_pop_id,
    (SELECT jsonb_build_object('id', e.id, 'code', e.code)
      FROM apflora.ekfrequenz e WHERE e.id = t.ekfrequenz)
      AS ekfrequenz_by_ekfrequenz,
    (SELECT jsonb_build_object('id', ad.id, 'name', ad.name)
      FROM apflora.adresse ad WHERE ad.id = t.ekf_kontrolleur)
      AS adresse_by_ekf_kontrolleur
  FROM apflora.tpop t;
GRANT SELECT ON apflora.v_tpop TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpop_apberrelevant_grund_werte WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpop_apberrelevant_grund_werte_label(t) AS label
  FROM apflora.tpop_apberrelevant_grund_werte t;
GRANT SELECT ON apflora.v_tpop_apberrelevant_grund_werte TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopber_label(t) AS label
  FROM apflora.tpopber t;
GRANT SELECT ON apflora.v_tpopber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopkontrzaehl WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopkontrzaehl_label(t) AS label
  FROM apflora.tpopkontrzaehl t;
GRANT SELECT ON apflora.v_tpopkontrzaehl TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopkontrzaehl_einheit_werte WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopkontrzaehl_einheit_werte_label(t) AS label
  FROM apflora.tpopkontrzaehl_einheit_werte t;
GRANT SELECT ON apflora.v_tpopkontrzaehl_einheit_werte TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopmassn WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopmassn_label(t) AS label,
    (SELECT jsonb_build_object('id', w.id, 'anpflanzung', w.anpflanzung)
      FROM apflora.tpopmassn_typ_werte w WHERE w.code = t.typ)
      AS tpopmassn_typ_werte_by_typ,
    (SELECT jsonb_build_object('id', c.id, 'popByPopId',
        jsonb_build_object('id', p.id, 'apByApId',
          jsonb_build_object('id', a.id, 'ekzaehleinheitsByApId', jsonb_build_object('nodes', (
            SELECT coalesce(jsonb_agg(jsonb_build_object(
              'id', e.id, 'zaehleinheitId', e.zaehleinheit_id,
              'notMassnCountUnit', e.not_massn_count_unit)
              ORDER BY e.sort), '[]'::jsonb)
            FROM apflora.ekzaehleinheit e
            WHERE e.ap_id = a.id AND e.zielrelevant)))))
      FROM apflora.tpop c
      JOIN apflora.pop p ON p.id = c.pop_id
      JOIN apflora.ap a ON a.id = p.ap_id
      WHERE c.id = t.tpop_id) AS tpop_by_tpop_id
  FROM apflora.tpopmassn t;
GRANT SELECT ON apflora.v_tpopmassn TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopmassnber WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopmassnber_label(t) AS label,
    (SELECT jsonb_build_object('id', c.id, 'popByPopId',
        jsonb_build_object('id', p.id, 'apId', p.ap_id))
      FROM apflora.tpop c JOIN apflora.pop p ON p.id = c.pop_id
      WHERE c.id = t.tpop_id) AS tpop_by_tpop_id
  FROM apflora.tpopmassnber t;
GRANT SELECT ON apflora.v_tpopmassnber TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_user WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.user_label(t) AS label
  FROM apflora.user t;
GRANT SELECT ON apflora.v_user TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ziel WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.ziel_label(t) AS label
  FROM apflora.ziel t;
GRANT SELECT ON apflora.v_ziel TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpopkontr WITH (security_invoker = true) AS
  SELECT
    t.*,
    apflora.tpopkontr_label_ek(t) AS label_ek,
    apflora.tpopkontr_label_ekf(t) AS label_ekf,
    -- freiwkontr form chain: exactly the fields its interfaces declare
    (SELECT jsonb_build_object('usersByAdresseId',
        jsonb_build_object('totalCount',
          (SELECT count(*) FROM apflora.user u WHERE u.adresse_id = ad.id)))
      FROM apflora.adresse ad WHERE ad.id = t.bearbeiter)
      AS adresse_by_bearbeiter,
    (SELECT jsonb_build_object(
        'nr', c.nr, 'flurname', c.flurname,
        'lv95X', public.lv95_x(c), 'lv95Y', public.lv95_y(c),
        'status', c.status,
        'popByPopId', jsonb_build_object(
          'nr', p.nr, 'name', p.name, 'apId', p.ap_id,
          'apByApId', jsonb_build_object(
            'id', a.id, 'ekfBeobachtungszeitpunkt', a.ekf_beobachtungszeitpunkt,
            'aeTaxonomyByArtId', jsonb_build_object(
              'artname', x.artname),
            'ekzaehleinheitsByApId', jsonb_build_object('nodes',
              (SELECT coalesce(jsonb_agg(jsonb_build_object(
                'id', e.id, 'sort', e.sort, 'zielrelevant', e.zielrelevant,
                'tpopkontrzaehlEinheitWerteByZaehleinheitId', (
                  SELECT jsonb_build_object('id', w.id, 'code', w.code,
                    'text', w.text, 'sort', w.sort, 'historic', w.historic)
                  FROM apflora.tpopkontrzaehl_einheit_werte w
                  WHERE w.id = e.zaehleinheit_id))
                ORDER BY e.sort), '[]'::jsonb)
              FROM apflora.ekzaehleinheit e WHERE e.ap_id = a.id)))))
      FROM apflora.tpop c
      JOIN apflora.pop p ON p.id = c.pop_id
      JOIN apflora.ap a ON a.id = p.ap_id
      LEFT JOIN apflora.ae_taxonomies x ON x.id = a.art_id
      WHERE c.id = t.tpop_id) AS tpop_by_tpop_id,
    (SELECT jsonb_build_object('nodes',
        (SELECT coalesce(jsonb_agg(jsonb_build_object(
          'id', z.id, 'tpopkontrId', z.tpopkontr_id,
          'einheit', z.einheit, 'anzahl', z.anzahl, 'methode', z.methode)
          ORDER BY z.einheit), '[]'::jsonb)
        FROM apflora.tpopkontrzaehl z WHERE z.tpopkontr_id = t.id)))
      AS tpopkontrzaehls_by_tpopkontr_id
  FROM apflora.tpopkontr t;
GRANT SELECT ON apflora.v_tpopkontr TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_ekfrequenz WITH (security_invoker = true) AS
  SELECT
    t.*,
    (SELECT jsonb_build_object('id', a.id, 'ekfrequenzsByApId', jsonb_build_object('nodes',
        (SELECT coalesce(jsonb_agg(jsonb_build_object(
          'id', c.id, 'apId', c.ap_id, 'ektyp', c.ektyp,
          'anwendungsfall', c.anwendungsfall, 'code', c.code,
          'kontrolljahre', c.kontrolljahre, 'kontrolljahreAb', c.kontrolljahre_ab,
          'bemerkungen', c.bemerkungen, 'sort', c.sort,
          'ekAbrechnungstyp', c.ek_abrechnungstyp,
          'changedBy', c.changed_by) ORDER BY c.sort), '[]'::jsonb)
          FROM apflora.ekfrequenz c WHERE c.ap_id = a.id)))
      FROM apflora.ap a WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.ekfrequenz t;
GRANT SELECT ON apflora.v_ekfrequenz TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;


-- history views: base table plus the werte/adresse relations the
-- Historien lists render per row
CREATE OR REPLACE VIEW apflora.v_ap_history WITH (security_invoker = true) AS
  SELECT
    t.*,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.ap_bearbstand_werte w WHERE w.code = t.bearbeitung)
      AS ap_bearbstand_werte_by_bearbeitung,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.ap_umsetzung_werte w WHERE w.code = t.umsetzung)
      AS ap_umsetzung_werte_by_umsetzung,
    (SELECT jsonb_build_object('id', ad.id, 'name', ad.name)
      FROM apflora.adresse ad WHERE ad.id = t.bearbeiter)
      AS adresse_by_bearbeiter,
    (SELECT jsonb_build_object('id', x.id, 'artname', x.artname)
      FROM apflora.ae_taxonomies x WHERE x.id = t.art_id)
      AS ae_taxonomy_by_art_id
  FROM apflora.ap_history t;
GRANT SELECT ON apflora.v_ap_history TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_pop_history WITH (security_invoker = true) AS
  SELECT
    t.*,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.pop_status_werte w WHERE w.code = t.status)
      AS pop_status_werte_by_status,
    (SELECT jsonb_build_object('id', a.id, 'aeTaxonomyByArtId',
        jsonb_build_object('id', x.id, 'artname', x.artname))
      FROM apflora.ap a JOIN apflora.ae_taxonomies x ON x.id = a.art_id
      WHERE a.id = t.ap_id) AS ap_by_ap_id
  FROM apflora.pop_history t;
GRANT SELECT ON apflora.v_pop_history TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

CREATE OR REPLACE VIEW apflora.v_tpop_history WITH (security_invoker = true) AS
  SELECT
    t.*,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.pop_status_werte w WHERE w.code = t.status)
      AS pop_status_werte_by_status,
    (SELECT jsonb_build_object('id', w.id, 'text', w.text)
      FROM apflora.tpop_apberrelevant_grund_werte w
      WHERE w.code = t.apber_relevant_grund)
      AS tpop_apberrelevant_grund_werte_by_apber_relevant_grund,
    (SELECT jsonb_build_object('id', e.id, 'code', e.code)
      FROM apflora.ekfrequenz e WHERE e.id = t.ekfrequenz)
      AS ekfrequenz_by_ekfrequenz,
    (SELECT jsonb_build_object('id', ad.id, 'name', ad.name)
      FROM apflora.adresse ad WHERE ad.id = t.ekf_kontrolleur)
      AS adresse_by_ekf_kontrolleur,
    (SELECT jsonb_build_object('id', p.id, 'label', apflora.pop_label(p), 'nr', p.nr)
      FROM apflora.pop p WHERE p.id = t.pop_id) AS pop_by_pop_id
  FROM apflora.tpop_history t;
GRANT SELECT ON apflora.v_tpop_history TO apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
