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
  select coalesce(apber.jahr::text, '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.apber_label(apflora.apber) is E'@sortable';

drop function if exists apflora.apberuebersicht_label(apberuebersicht apflora.apberuebersicht);
create function apflora.apberuebersicht_label(apberuebersicht apflora.apberuebersicht) returns text as $$
  select coalesce(apberuebersicht.jahr::text, '(kein Jahr)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.apberuebersicht_label(apflora.apberuebersicht) is E'@sortable';

drop function if exists apflora.erfkrit_label(erfkrit apflora.erfkrit);
create function apflora.erfkrit_label(erfkrit apflora.erfkrit) returns text as $$
  select coalesce((select text from apflora.ap_erfkrit_werte where apflora.ap_erfkrit_werte.code = erfkrit.erfolg), '(nicht beurteilt)') || ': ' || COALESCE(erfkrit.kriterien, '(keine Kriterien erfasst)')
$$ language sql stable;
-- make label sortable, as of PostGraphile 4.4/postgraphile@next
comment on function apflora.erfkrit_label(apflora.erfkrit) is E'@sortable';







