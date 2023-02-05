-- see:
-- https://www.graphile.org/postgraphile/computed-columns/
-- https://github.com/graphile/postgraphile/issues/119#issuecomment-479445316
DROP FUNCTION IF EXISTS apflora.adresse_label (adresse apflora.adresse);

CREATE FUNCTION apflora.adresse_label (adresse apflora.adresse)
  RETURNS text
  AS $$
  SELECT
    coalesce(adresse.name, '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.adresse_label (apflora.adresse) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpop_apberrelevant_grund_werte_label (tpop_apberrelevant_grund_werte apflora.tpop_apberrelevant_grund_werte);

CREATE FUNCTION apflora.tpop_apberrelevant_grund_werte_label (tpop_apberrelevant_grund_werte apflora.tpop_apberrelevant_grund_werte)
  RETURNS text
  AS $$
  SELECT
    coalesce(tpop_apberrelevant_grund_werte.text, '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpop_apberrelevant_grund_werte_label (apflora.tpop_apberrelevant_grund_werte) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopkontrzaehl_einheit_werte_label (tpopkontrzaehl_einheit_werte apflora.tpopkontrzaehl_einheit_werte);

CREATE FUNCTION apflora.tpopkontrzaehl_einheit_werte_label (tpopkontrzaehl_einheit_werte apflora.tpopkontrzaehl_einheit_werte)
  RETURNS text
  AS $$
  SELECT
    coalesce(tpopkontrzaehl_einheit_werte.text, '(keine Einheit)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopkontrzaehl_einheit_werte_label (apflora.tpopkontrzaehl_einheit_werte) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.ek_abrechnungstyp_werte_label (ek_abrechnungstyp_werte apflora.ek_abrechnungstyp_werte);

CREATE FUNCTION apflora.ek_abrechnungstyp_werte_label (ek_abrechnungstyp_werte apflora.ek_abrechnungstyp_werte)
  RETURNS text
  AS $$
  SELECT
    coalesce(ek_abrechnungstyp_werte.text, '(keine Einheit)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.ek_abrechnungstyp_werte_label (apflora.ek_abrechnungstyp_werte) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.ap_label (ap apflora.ap);

CREATE FUNCTION apflora.ap_label (ap apflora.ap)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        artname
      FROM apflora.ae_taxonomies
      WHERE
        apflora.ae_taxonomies.id = ap.art_id), '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.ap_label (apflora.ap) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.apart_label (apart apflora.apart);

CREATE OR REPLACE FUNCTION apflora.apart_label (apart apflora.apart)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        tax_art_name
      FROM apflora.ae_taxonomies
      WHERE
        apflora.ae_taxonomies.id = apart.art_id), '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.apart_label (apflora.apart) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.apber_label (apber apflora.apber);

CREATE FUNCTION apflora.apber_label (apber apflora.apber)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(apber.jahr::text, 4, '0'), '(kein Jahr)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.apber_label (apflora.apber) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.apberuebersicht_label (apberuebersicht apflora.apberuebersicht);

CREATE FUNCTION apflora.apberuebersicht_label (apberuebersicht apflora.apberuebersicht)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(apberuebersicht.jahr::text, 4, '0'), '(kein Jahr)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.apberuebersicht_label (apflora.apberuebersicht) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.ekzaehleinheit_label (ekzaehleinheit apflora.ekzaehleinheit);

CREATE OR REPLACE FUNCTION apflora.ekzaehleinheit_label (ekzaehleinheit apflora.ekzaehleinheit)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        text
      FROM apflora.tpopkontrzaehl_einheit_werte
      WHERE
        apflora.tpopkontrzaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id), '(keine Zähleinheit gewählt)')
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION apflora.ekzaehleinheit_label (apflora.ekzaehleinheit) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.erfkrit_label (erfkrit apflora.erfkrit);

CREATE FUNCTION apflora.erfkrit_label (erfkrit apflora.erfkrit)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        text
      FROM apflora.ap_erfkrit_werte
      WHERE
        apflora.ap_erfkrit_werte.code = erfkrit.erfolg), '(nicht beurteilt)') || ': ' || coalesce(erfkrit.kriterien, '(keine Kriterien erfasst)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.erfkrit_label (apflora.erfkrit) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.ziel_label (ziel apflora.ziel);

CREATE FUNCTION apflora.ziel_label (ziel apflora.ziel)
  RETURNS text
  AS $$
  SELECT
    coalesce(ziel.bezeichnung, '(kein Ziel)') || ' (' || coalesce((
      SELECT
        text
      FROM apflora.ziel_typ_werte
      WHERE
        apflora.ziel_typ_werte.code = ziel.typ), 'kein Typ') || ')'
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.ziel_label (apflora.ziel) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.zielber_label (zielber apflora.zielber);

CREATE FUNCTION apflora.zielber_label (zielber apflora.zielber)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(zielber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce(zielber.erreichung, '(nicht beurteilt)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.zielber_label (apflora.zielber) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.assozart_label (assozart apflora.assozart);

CREATE OR REPLACE FUNCTION apflora.assozart_label (assozart apflora.assozart)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        tax_art_name
      FROM apflora.ae_taxonomies
      WHERE
        apflora.ae_taxonomies.id = assozart.ae_id), '(keine Art gewählt)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.assozart_label (apflora.assozart) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.currentissue_label (currentissue apflora.currentissue);

CREATE FUNCTION apflora.currentissue_label (currentissue apflora.currentissue)
  RETURNS text
  AS $$
  SELECT
    coalesce(currentissue.title, '(kein Titel)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.currentissue_label (apflora.currentissue) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.pop_label (pop apflora.pop);

CREATE FUNCTION apflora.pop_label (pop apflora.pop)
  RETURNS text
  AS $$
  SELECT
    coalesce(pop.nr::text, '(keine Nr)') || ': ' || coalesce(pop.name, '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.pop_label (apflora.pop) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.popber_label (popber apflora.popber);

CREATE FUNCTION apflora.popber_label (popber apflora.popber)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(popber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((
      SELECT
        text
      FROM apflora.tpop_entwicklung_werte
      WHERE
        apflora.tpop_entwicklung_werte.code = popber.entwicklung), '(nicht beurteilt)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.popber_label (apflora.popber) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.popmassnber_label (popmassnber apflora.popmassnber);

CREATE FUNCTION apflora.popmassnber_label (popmassnber apflora.popmassnber)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(popmassnber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((
      SELECT
        text
      FROM apflora.tpopmassn_erfbeurt_werte
      WHERE
        apflora.tpopmassn_erfbeurt_werte.code = popmassnber.beurteilung), '(nicht beurteilt)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.popmassnber_label (apflora.popmassnber) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.projekt_label (projekt apflora.projekt);

CREATE FUNCTION apflora.projekt_label (projekt apflora.projekt)
  RETURNS text
  AS $$
  SELECT
    coalesce(projekt.name, '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.projekt_label (apflora.projekt) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpop_label (tpop apflora.tpop);

CREATE FUNCTION apflora.tpop_label (tpop apflora.tpop)
  RETURNS text
  AS $$
  SELECT
    coalesce(tpop.nr::text, '(keine Nr)') || ': ' || coalesce(tpop.flurname, '(kein Flurname)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpop_label (apflora.tpop) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpop_ap_name (apflora.tpop);

CREATE FUNCTION apflora.tpop_ap_name (tpop apflora.tpop)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        apflora.ae_taxonomies.artname
      FROM apflora.pop
      INNER JOIN apflora.ap
      INNER JOIN apflora.ae_taxonomies ON apflora.ap.art_id = apflora.ae_taxonomies.id ON apflora.pop.ap_id = apflora.ap.id
      WHERE
        apflora.pop.id = tpop.pop_id), '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpop_ap_name (apflora.tpop) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopber_label (tpopber apflora.tpopber);

CREATE FUNCTION apflora.tpopber_label (tpopber apflora.tpopber)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(tpopber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((
      SELECT
        text
      FROM apflora.tpop_entwicklung_werte
      WHERE
        apflora.tpop_entwicklung_werte.code = tpopber.entwicklung), '(nicht beurteilt)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopber_label (apflora.tpopber) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopmassnber_label (tpopmassnber apflora.tpopmassnber);

CREATE FUNCTION apflora.tpopmassnber_label (tpopmassnber apflora.tpopmassnber)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(tpopmassnber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((
      SELECT
        text
      FROM apflora.tpopmassn_erfbeurt_werte
      WHERE
        apflora.tpopmassn_erfbeurt_werte.code = tpopmassnber.beurteilung), '(nicht beurteilt)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopmassnber_label (apflora.tpopmassnber) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopkontr_label_ek (tpopkontr apflora.tpopkontr);

CREATE FUNCTION apflora.tpopkontr_label_ek (tpopkontr apflora.tpopkontr)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(tpopkontr.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce(tpopkontr.typ, '(kein Typ)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopkontr_label_ek (apflora.tpopkontr) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopkontr_label_ekf (tpopkontr apflora.tpopkontr);

CREATE FUNCTION apflora.tpopkontr_label_ekf (tpopkontr apflora.tpopkontr)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(tpopkontr.jahr::text, 4, '0'), '(kein Jahr)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopkontr_label_ekf (apflora.tpopkontr) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopkontr_ap_name (apflora.tpopkontr);

CREATE FUNCTION apflora.tpopkontr_ap_name (tpopkontr apflora.tpopkontr)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        apflora.ae_taxonomies.artname
      FROM apflora.tpop
      INNER JOIN apflora.pop
      INNER JOIN apflora.ap
      INNER JOIN apflora.ae_taxonomies ON apflora.ap.art_id = apflora.ae_taxonomies.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.tpop.pop_id = apflora.pop.id
      WHERE
        apflora.tpop.id = tpopkontr.tpop_id), '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopkontr_ap_name (apflora.tpopkontr) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopkontr_pop_nr (apflora.tpopkontr);

CREATE FUNCTION apflora.tpopkontr_pop_nr (tpopkontr apflora.tpopkontr)
  RETURNS integer
  AS $$
  SELECT
    coalesce((
      SELECT
        apflora.pop.nr
      FROM apflora.tpop
      INNER JOIN apflora.pop ON apflora.tpop.pop_id = apflora.pop.id
      WHERE
        apflora.tpop.id = tpopkontr.tpop_id), 0)
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopkontr_pop_nr (apflora.tpopkontr) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopkontrzaehl_label (tpopkontrzaehl apflora.tpopkontrzaehl);

CREATE OR REPLACE FUNCTION apflora.tpopkontrzaehl_label (tpopkontrzaehl apflora.tpopkontrzaehl)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        text
      FROM apflora.tpopkontrzaehl_einheit_werte
      WHERE
        apflora.tpopkontrzaehl_einheit_werte.code = tpopkontrzaehl.einheit), '(keine Einheit)') || ': ' || COALESCE(tpopkontrzaehl.anzahl::text, '(keine Anzahl)') || ' ' || COALESCE((
      SELECT
        text
      FROM apflora.tpopkontrzaehl_methode_werte
      WHERE
        apflora.tpopkontrzaehl_methode_werte.code = tpopkontrzaehl.methode), '(keine Methode)')
$$
LANGUAGE sql
STABLE;

COMMENT ON FUNCTION apflora.tpopkontrzaehl_label (apflora.tpopkontrzaehl) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopmassn_label (tpopmassn apflora.tpopmassn);

CREATE FUNCTION apflora.tpopmassn_label (tpopmassn apflora.tpopmassn)
  RETURNS text
  AS $$
  SELECT
    coalesce(lpad(tpopmassn.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((
      SELECT
        text
      FROM apflora.tpopmassn_typ_werte
      WHERE
        apflora.tpopmassn_typ_werte.code = tpopmassn.typ), '(kein Typ)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopmassn_label (apflora.tpopmassn) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopmassn_ap_name (apflora.tpopmassn);

CREATE FUNCTION apflora.tpopmassn_ap_name (tpopmassn apflora.tpopmassn)
  RETURNS text
  AS $$
  SELECT
    coalesce((
      SELECT
        apflora.ae_taxonomies.artname
      FROM apflora.tpop
      INNER JOIN apflora.pop
      INNER JOIN apflora.ap
      INNER JOIN apflora.ae_taxonomies ON apflora.ap.art_id = apflora.ae_taxonomies.id ON apflora.pop.ap_id = apflora.ap.id ON apflora.tpop.pop_id = apflora.pop.id
      WHERE
        apflora.tpop.id = tpopmassn.tpop_id), '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopmassn_ap_name (apflora.tpopmassn) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.tpopmassn_pop_nr (apflora.tpopmassn);

CREATE FUNCTION apflora.tpopmassn_pop_nr (tpopmassn apflora.tpopmassn)
  RETURNS integer
  AS $$
  SELECT
    coalesce((
      SELECT
        apflora.pop.nr
      FROM apflora.tpop
      INNER JOIN apflora.pop ON apflora.tpop.pop_id = apflora.pop.id
      WHERE
        apflora.tpop.id = tpopmassn.tpop_id), 0)
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.tpopmassn_pop_nr (apflora.tpopmassn) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.user_label (u apflora.user);

CREATE FUNCTION apflora.user_label (u apflora.user)
  RETURNS text
  AS $$
  SELECT
    coalesce(u.name || ' (' || replace(u.role, 'apflora_', '') || ')', '(kein Name)')
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.user_label (apflora.user) IS e'@sortable';

DROP FUNCTION IF EXISTS apflora.beob_label (beob apflora.beob);

CREATE OR REPLACE FUNCTION apflora.beob_label (beob apflora.beob)
  RETURNS text
  AS $$
  SELECT
    to_char(beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(beob.autor, '(kein Autor)') || ' (' || beob.quelle || ')'
$$
LANGUAGE sql
STABLE;

-- make label sortable, as of postgraphile 4.4/postgraphile@next
COMMENT ON FUNCTION apflora.beob_label (apflora.beob) IS e'@sortable';

