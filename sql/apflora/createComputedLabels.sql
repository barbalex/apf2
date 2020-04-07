-- see:
-- https://www.graphile.org/postgraphile/computed-columns/
-- https://github.com/graphile/postgraphile/issues/119#issuecomment-479445316

drop function if exists apflora.adresse_label(adresse apflora.adresse);
create function apflora.adresse_label(adresse apflora.adresse) returns text as $$
  select coalesce(adresse.name, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.adresse_label(apflora.adresse) is e'@sortable';

drop function if exists apflora.tpop_apberrelevant_grund_werte_label(tpop_apberrelevant_grund_werte apflora.tpop_apberrelevant_grund_werte);
create function apflora.tpop_apberrelevant_grund_werte_label(tpop_apberrelevant_grund_werte apflora.tpop_apberrelevant_grund_werte) returns text as $$
  select coalesce(tpop_apberrelevant_grund_werte.text, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpop_apberrelevant_grund_werte_label(apflora.tpop_apberrelevant_grund_werte) is e'@sortable';

drop function if exists apflora.tpopkontrzaehl_einheit_werte_label(tpopkontrzaehl_einheit_werte apflora.tpopkontrzaehl_einheit_werte);
create function apflora.tpopkontrzaehl_einheit_werte_label(tpopkontrzaehl_einheit_werte apflora.tpopkontrzaehl_einheit_werte) returns text as $$
  select coalesce(tpopkontrzaehl_einheit_werte.text, '(keine Einheit)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopkontrzaehl_einheit_werte_label(apflora.tpopkontrzaehl_einheit_werte) is e'@sortable';

drop function if exists apflora.ek_abrechnungstyp_werte_label(ek_abrechnungstyp_werte apflora.ek_abrechnungstyp_werte);
create function apflora.ek_abrechnungstyp_werte_label(ek_abrechnungstyp_werte apflora.ek_abrechnungstyp_werte) returns text as $$
  select coalesce(ek_abrechnungstyp_werte.text, '(keine Einheit)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.ek_abrechnungstyp_werte_label(apflora.ek_abrechnungstyp_werte) is e'@sortable';

drop function if exists apflora.ap_label(ap apflora.ap);
create function apflora.ap_label(ap apflora.ap) returns text as $$
  select coalesce((select artname from apflora.ae_taxonomies where apflora.ae_taxonomies.id = ap.art_id), '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.ap_label(apflora.ap) is e'@sortable';

drop function if exists apflora.apart_label(apart apflora.apart);
create function apflora.apart_label(apart apflora.apart) returns text as $$
  select coalesce((select artname from apflora.ae_taxonomies where apflora.ae_taxonomies.id = apart.art_id), '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.apart_label(apflora.apart) is e'@sortable';

drop function if exists apflora.apber_label(apber apflora.apber);
create function apflora.apber_label(apber apflora.apber) returns text as $$
  select coalesce(lpad(apber.jahr::text, 4, '0'), '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.apber_label(apflora.apber) is e'@sortable';

drop function if exists apflora.apberuebersicht_label(apberuebersicht apflora.apberuebersicht);
create function apflora.apberuebersicht_label(apberuebersicht apflora.apberuebersicht) returns text as $$
  select coalesce(lpad(apberuebersicht.jahr::text, 4, '0'), '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.apberuebersicht_label(apflora.apberuebersicht) is e'@sortable';

drop function if exists apflora.ekzaehleinheit_label(ekzaehleinheit apflora.ekzaehleinheit);
create or replace function apflora.ekzaehleinheit_label(ekzaehleinheit apflora.ekzaehleinheit) returns text as $$
  select coalesce((select text from apflora.tpopkontrzaehl_einheit_werte where apflora.tpopkontrzaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id), '(keine Zähleinheit gewählt)')
$$ language sql stable;
comment on function apflora.ekzaehleinheit_label(apflora.ekzaehleinheit) is e'@sortable';

drop function if exists apflora.erfkrit_label(erfkrit apflora.erfkrit);
create function apflora.erfkrit_label(erfkrit apflora.erfkrit) returns text as $$
  select coalesce((select text from apflora.ap_erfkrit_werte where apflora.ap_erfkrit_werte.code = erfkrit.erfolg), '(nicht beurteilt)') || ': ' || coalesce(erfkrit.kriterien, '(keine Kriterien erfasst)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.erfkrit_label(apflora.erfkrit) is e'@sortable';

drop function if exists apflora.ziel_label(ziel apflora.ziel);
create function apflora.ziel_label(ziel apflora.ziel) returns text as $$
  select coalesce(ziel.bezeichnung, '(kein Ziel)') || ' (' || coalesce((select text from apflora.ziel_typ_werte where apflora.ziel_typ_werte.code = ziel.typ), 'kein Typ') || ')'
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.ziel_label(apflora.ziel) is e'@sortable';

drop function if exists apflora.zielber_label(zielber apflora.zielber);
create function apflora.zielber_label(zielber apflora.zielber) returns text as $$
  select coalesce(lpad(zielber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce(zielber.erreichung, '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.zielber_label(apflora.zielber) is e'@sortable';

drop function if exists apflora.assozart_label(assozart apflora.assozart);
create function apflora.assozart_label(assozart apflora.assozart) returns text as $$
  select coalesce((select artname from apflora.ae_taxonomies where apflora.ae_taxonomies.id = assozart.ae_id), '(keine Art gewählt)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.assozart_label(apflora.assozart) is e'@sortable';

-- TODO:
drop function if exists apflora.ber_label(ber apflora.ber);

drop function if exists apflora.currentissue_label(currentissue apflora.currentissue);
create function apflora.currentissue_label(currentissue apflora.currentissue) returns text as $$
  select coalesce(currentissue.title, '(kein Titel)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.currentissue_label(apflora.currentissue) is e'@sortable';

drop function if exists apflora.pop_label(pop apflora.pop);
create function apflora.pop_label(pop apflora.pop) returns text as $$
  select coalesce(pop.nr::text, '(keine Nr)') || ': ' || coalesce(pop.name, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.pop_label(apflora.pop) is e'@sortable';

drop function if exists apflora.popber_label(popber apflora.popber);
create function apflora.popber_label(popber apflora.popber) returns text as $$
  select coalesce(lpad(popber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpop_entwicklung_werte where apflora.tpop_entwicklung_werte.code = popber.entwicklung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.popber_label(apflora.popber) is e'@sortable';

drop function if exists apflora.popmassnber_label(popmassnber apflora.popmassnber);
create function apflora.popmassnber_label(popmassnber apflora.popmassnber) returns text as $$
  select coalesce(lpad(popmassnber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpopmassn_erfbeurt_werte where apflora.tpopmassn_erfbeurt_werte.code = popmassnber.beurteilung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.popmassnber_label(apflora.popmassnber) is e'@sortable';

drop function if exists apflora.projekt_label(projekt apflora.projekt);
create function apflora.projekt_label(projekt apflora.projekt) returns text as $$
  select coalesce(projekt.name, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.projekt_label(apflora.projekt) is e'@sortable';

drop function if exists apflora.tpop_label(tpop apflora.tpop);
create function apflora.tpop_label(tpop apflora.tpop) returns text as $$
  select coalesce(tpop.nr::text, '(keine Nr)') || ': ' || coalesce(tpop.flurname, '(kein Flurname)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpop_label(apflora.tpop) is e'@sortable';

drop function if exists apflora.tpop_ap_name(apflora.tpop);
create function apflora.tpop_ap_name(tpop apflora.tpop) returns text as $$
  select coalesce(
    (
      select apflora.ae_taxonomies.artname
      from
        apflora.pop
          inner join apflora.ap
            inner join apflora.ae_taxonomies
            on apflora.ap.art_id = apflora.ae_taxonomies.id
          on apflora.pop.ap_id = apflora.ap.id
      where apflora.pop.id = tpop.pop_id
    )
    , '(kein Name)'
  )
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpop_ap_name(apflora.tpop) is e'@sortable';

drop function if exists apflora.tpopber_label(tpopber apflora.tpopber);
create function apflora.tpopber_label(tpopber apflora.tpopber) returns text as $$
  select coalesce(lpad(tpopber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpop_entwicklung_werte where apflora.tpop_entwicklung_werte.code = tpopber.entwicklung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopber_label(apflora.tpopber) is e'@sortable';

drop function if exists apflora.tpopmassnber_label(tpopmassnber apflora.tpopmassnber);
create function apflora.tpopmassnber_label(tpopmassnber apflora.tpopmassnber) returns text as $$
  select coalesce(lpad(tpopmassnber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpopmassn_erfbeurt_werte where apflora.tpopmassn_erfbeurt_werte.code = tpopmassnber.beurteilung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopmassnber_label(apflora.tpopmassnber) is e'@sortable';

drop function if exists apflora.tpopkontr_label_ek(tpopkontr apflora.tpopkontr);
create function apflora.tpopkontr_label_ek(tpopkontr apflora.tpopkontr) returns text as $$
  select coalesce(lpad(tpopkontr.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce(tpopkontr.typ, '(kein Typ)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopkontr_label_ek(apflora.tpopkontr) is e'@sortable';

drop function if exists apflora.tpopkontr_label_ekf(tpopkontr apflora.tpopkontr);
create function apflora.tpopkontr_label_ekf(tpopkontr apflora.tpopkontr) returns text as $$
  select coalesce(lpad(tpopkontr.jahr::text, 4, '0'), '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopkontr_label_ekf(apflora.tpopkontr) is e'@sortable';

drop function if exists apflora.tpopkontr_ap_name(apflora.tpopkontr);
create function apflora.tpopkontr_ap_name(tpopkontr apflora.tpopkontr) returns text as $$
  select coalesce(
    (
      select apflora.ae_taxonomies.artname
      from
        apflora.tpop
        inner join apflora.pop
          inner join apflora.ap
            inner join apflora.ae_taxonomies
            on apflora.ap.art_id = apflora.ae_taxonomies.id
          on apflora.pop.ap_id = apflora.ap.id
        on apflora.tpop.pop_id = apflora.pop.id
      where apflora.tpop.id = tpopkontr.tpop_id
    )
    , '(kein Name)'
  )
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopkontr_ap_name(apflora.tpopkontr) is e'@sortable';

drop function if exists apflora.tpopkontr_pop_nr(apflora.tpopkontr);
create function apflora.tpopkontr_pop_nr(tpopkontr apflora.tpopkontr) returns integer as $$
  select coalesce(
    (
      select apflora.pop.nr
      from
        apflora.tpop
        inner join apflora.pop
        on apflora.tpop.pop_id = apflora.pop.id
      where apflora.tpop.id = tpopkontr.tpop_id
    )
    , 0
  )
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopkontr_pop_nr(apflora.tpopkontr) is e'@sortable';

drop function if exists apflora.tpopkontrzaehl_label(tpopkontrzaehl apflora.tpopkontrzaehl);
create or replace function apflora.tpopkontrzaehl_label(tpopkontrzaehl apflora.tpopkontrzaehl) returns text as $$
  select coalesce((select text from apflora.tpopkontrzaehl_einheit_werte where apflora.tpopkontrzaehl_einheit_werte.code = tpopkontrzaehl.einheit), '(keine Einheit)') || ': ' || COALESCE(tpopkontrzaehl.anzahl::text, '(keine Anzahl)') || ' ' || COALESCE((select text from apflora.tpopkontrzaehl_methode_werte where apflora.tpopkontrzaehl_methode_werte.code = tpopkontrzaehl.methode), '(keine Methode)')
$$ language sql stable;
comment on function apflora.tpopkontrzaehl_label(apflora.tpopkontrzaehl) is e'@sortable';

drop function if exists apflora.tpopmassn_label(tpopmassn apflora.tpopmassn);
create function apflora.tpopmassn_label(tpopmassn apflora.tpopmassn) returns text as $$
  select coalesce(lpad(tpopmassn.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpopmassn_typ_werte where apflora.tpopmassn_typ_werte.code = tpopmassn.typ), '(kein Typ)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopmassn_label(apflora.tpopmassn) is e'@sortable';

drop function if exists apflora.tpopmassn_ap_name(apflora.tpopmassn);
create function apflora.tpopmassn_ap_name(tpopmassn apflora.tpopmassn) returns text as $$
  select coalesce(
    (
      select apflora.ae_taxonomies.artname
      from
        apflora.tpop
        inner join apflora.pop
          inner join apflora.ap
            inner join apflora.ae_taxonomies
            on apflora.ap.art_id = apflora.ae_taxonomies.id
          on apflora.pop.ap_id = apflora.ap.id
        on apflora.tpop.pop_id = apflora.pop.id
      where apflora.tpop.id = tpopmassn.tpop_id
    )
    , '(kein Name)'
  )
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopmassn_ap_name(apflora.tpopmassn) is e'@sortable';

drop function if exists apflora.tpopmassn_pop_nr(apflora.tpopmassn);
create function apflora.tpopmassn_pop_nr(tpopmassn apflora.tpopmassn) returns integer as $$
  select coalesce(
    (
      select apflora.pop.nr
      from
        apflora.tpop
        inner join apflora.pop
        on apflora.tpop.pop_id = apflora.pop.id
      where apflora.tpop.id = tpopmassn.tpop_id
    )
    , 0
  )
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.tpopmassn_pop_nr(apflora.tpopmassn) is e'@sortable';

drop function if exists apflora.user_label(u apflora.user);
create function apflora.user_label(u apflora.user) returns text as $$
  select coalesce(u.name || ' (' || replace(u.role, 'apflora_', '') || ')', '(kein Name)')
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.user_label(apflora.user) is e'@sortable';

drop function if exists apflora.beob_label(beob apflora.beob);
create function apflora.beob_label(beob apflora.beob) returns text as $$
  select to_char(beob.datum, 'YYYY.MM.DD') || ': ' || coalesce(beob.autor, '(kein Autor)') || ' (' || (select name from apflora.beob_quelle_werte where apflora.beob_quelle_werte.id = beob.quelle_id) || ')'
$$ language sql stable;
-- make label sortable, as of postgraphile 4.4/postgraphile@next
comment on function apflora.beob_label(apflora.beob) is e'@sortable';
