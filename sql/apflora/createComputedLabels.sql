-- see:
-- https://www.graphile.org/postgraphile/computed-columns/
-- https://github.com/graphile/postgraphile/issues/119#issuecomment-479445316

drop function if exists apflora.adresse_label(adresse apflora.adresse);
create function apflora.adresse_label(adresse apflora.adresse) returns text as $$
  select coalesce(adresse.name, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.adresse_label(apflora.adresse) is E'@sortable';

drop function if exists apflora.ap_label(ap apflora.ap);
create function apflora.ap_label(ap apflora.ap) returns text as $$
  select coalesce((select artname from apflora.ae_eigenschaften where apflora.ae_eigenschaften.id = ap.art_id), '(kein Name)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.ap_label(apflora.ap) is E'@sortable';

drop function if exists apflora.apart_label(apart apflora.apart);
create function apflora.apart_label(apart apflora.apart) returns text as $$
  select coalesce((select artname from apflora.ae_eigenschaften where apflora.ae_eigenschaften.id = apart.art_id), '(kein Name)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.apart_label(apflora.apart) is E'@sortable';

drop function if exists apflora.apber_label(apber apflora.apber);
create function apflora.apber_label(apber apflora.apber) returns text as $$
  select coalesce(LPAD(apber.jahr::text, 4, '0'), '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.apber_label(apflora.apber) is E'@sortable';

drop function if exists apflora.apberuebersicht_label(apberuebersicht apflora.apberuebersicht);
create function apflora.apberuebersicht_label(apberuebersicht apflora.apberuebersicht) returns text as $$
  select coalesce(LPAD(apberuebersicht.jahr::text, 4, '0'), '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.apberuebersicht_label(apflora.apberuebersicht) is E'@sortable';

drop function if exists apflora.erfkrit_label(erfkrit apflora.erfkrit);
create function apflora.erfkrit_label(erfkrit apflora.erfkrit) returns text as $$
  select coalesce((select text from apflora.ap_erfkrit_werte where apflora.ap_erfkrit_werte.code = erfkrit.erfolg), '(nicht beurteilt)') || ': ' || COALESCE(erfkrit.kriterien, '(keine Kriterien erfasst)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.erfkrit_label(apflora.erfkrit) is E'@sortable';

drop function if exists apflora.ziel_label(ziel apflora.ziel);
create function apflora.ziel_label(ziel apflora.ziel) returns text as $$
  select COALESCE(ziel.bezeichnung, '(kein Ziel)') || ' (' || coalesce((select text from apflora.ziel_typ_werte where apflora.ziel_typ_werte.code = ziel.typ), 'kein Typ') || ')'
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.ziel_label(apflora.ziel) is E'@sortable';

drop function if exists apflora.zielber_label(zielber apflora.zielber);
create function apflora.zielber_label(zielber apflora.zielber) returns text as $$
  select COALESCE(LPAD(zielber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || COALESCE(zielber.erreichung, '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.zielber_label(apflora.zielber) is E'@sortable';

drop function if exists apflora.assozart_label(assozart apflora.assozart);
create function apflora.assozart_label(assozart apflora.assozart) returns text as $$
  select coalesce((select artname from apflora.ae_eigenschaften where apflora.ae_eigenschaften.id = assozart.ae_id), '(keine Art gewählt)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.assozart_label(apflora.assozart) is E'@sortable';

drop function if exists apflora.ber_label(ber apflora.ber);
create function apflora.ber_label(ber apflora.ber) returns text as $$
  select COALESCE(LPAD(ber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || COALESCE(ber.titel, '(kein Titel)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.ber_label(apflora.ber) is E'@sortable';

drop function if exists apflora.currentissue_label(currentissue apflora.currentissue);
create function apflora.currentissue_label(currentissue apflora.currentissue) returns text as $$
  select COALESCE(currentissue.title, '(kein Titel)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.currentissue_label(apflora.currentissue) is E'@sortable';

drop function if exists apflora.pop_label(pop apflora.pop);
create function apflora.pop_label(pop apflora.pop) returns text as $$
  select COALESCE(pop.nr::text, '(keine Nr)') || ': ' || COALESCE(pop.name, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.pop_label(apflora.pop) is E'@sortable';

drop function if exists apflora.popber_label(popber apflora.popber);
create function apflora.popber_label(popber apflora.popber) returns text as $$
  select COALESCE(LPAD(popber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpop_entwicklung_werte where apflora.tpop_entwicklung_werte.code = popber.entwicklung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.popber_label(apflora.popber) is E'@sortable';

drop function if exists apflora.popmassnber_label(popmassnber apflora.popmassnber);
create function apflora.popmassnber_label(popmassnber apflora.popmassnber) returns text as $$
  select COALESCE(LPAD(popmassnber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpopmassn_erfbeurt_werte where apflora.tpopmassn_erfbeurt_werte.code = popmassnber.beurteilung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.popmassnber_label(apflora.popmassnber) is E'@sortable';

drop function if exists apflora.projekt_label(projekt apflora.projekt);
create function apflora.projekt_label(projekt apflora.projekt) returns text as $$
  select COALESCE(projekt.name, '(kein Name)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.projekt_label(apflora.projekt) is E'@sortable';

drop function if exists apflora.tpop_label(tpop apflora.tpop);
create function apflora.tpop_label(tpop apflora.tpop) returns text as $$
  select COALESCE(tpop.nr::text, '(keine Nr)') || ': ' || COALESCE(tpop.flurname, '(kein Flurname)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.tpop_label(apflora.tpop) is E'@sortable';

drop function if exists apflora.tpopber_label(tpopber apflora.tpopber);
create function apflora.tpopber_label(tpopber apflora.tpopber) returns text as $$
  select COALESCE(LPAD(tpopber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpop_entwicklung_werte where apflora.tpop_entwicklung_werte.code = tpopber.entwicklung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.tpopber_label(apflora.tpopber) is E'@sortable';

drop function if exists apflora.tpopmassnber_label(tpopmassnber apflora.tpopmassnber);
create function apflora.tpopmassnber_label(tpopmassnber apflora.tpopmassnber) returns text as $$
  select COALESCE(LPAD(tpopmassnber.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce((select text from apflora.tpopmassn_erfbeurt_werte where apflora.tpopmassn_erfbeurt_werte.code = tpopmassnber.beurteilung), '(nicht beurteilt)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.tpopmassnber_label(apflora.tpopmassnber) is E'@sortable';

drop function if exists apflora.tpopkontr_label_ek(tpopkontr apflora.tpopkontr);
create function apflora.tpopkontr_label_ek(tpopkontr apflora.tpopkontr) returns text as $$
  select COALESCE(LPAD(tpopkontr.jahr::text, 4, '0'), '(kein Jahr)') || ': ' || coalesce(tpopkontr.typ, '(kein Typ)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.tpopkontr_label_ek(apflora.tpopkontr) is E'@sortable';








