# regenerates sql/postgrest/createQueryRpcs.sql — the query_<table> RPC
# family for the tree/nav queries (phase 5). Run:
#   python3 scripts/generate-query-rpcs.py
# The q_<table> views are slim (base + label + coordinates) — deliberately
# without the v_<table> form views' heavy jsonb relation chains.
# The RPC joins the base table (alias tb) for filter compilation and the
# label functions (view rowtypes are not the base rowtype); it selects
# from the view so label/coordinates come along for free.
TABLES = [
    'ap', 'apart', 'apber', 'apberuebersicht', 'assozart', 'adresse', 'beob',
    'ek_abrechnungstyp_werte', 'ekfrequenz', 'ekzaehleinheit', 'erfkrit',
    'pop', 'popber', 'popmassnber', 'tpop', 'tpop_apberrelevant_grund_werte',
    'tpopber', 'tpopkontr', 'tpopkontrzaehl',
    'tpopkontrzaehl_einheit_werte', 'tpopmassn', 'tpopmassnber', 'user', 'ziel',
]
# tables whose label functions exist (checked against the dev db)
LABEL_TABLES = {
    'adresse', 'ap', 'apart', 'apber', 'apberuebersicht', 'assozart', 'beob',
    'currentissue', 'ek_abrechnungstyp_werte', 'ekzaehleinheit', 'erfkrit',
    'pop', 'popber', 'popmassnber', 'projekt', 'tpop',
    'tpop_apberrelevant_grund_werte', 'tpopber', 'tpopkontrzaehl',
    'tpopkontrzaehl_einheit_werte', 'tpopmassn', 'tpopmassnber', 'user',
    'ziel',
}
GEO_TABLES = {'pop', 'tpop', 'beob'}
GRANT = 'apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig'

RPC = '''create or replace function apflora.query_{t}(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_{t}
language plpgsql
stable
as $fn$
declare
  v_where text;
  v_order_parts text[] := array[]::text[];
  v_item jsonb;
  v_field text;
  v_dir text;
  v_nulls text;
  v_expr text;
  v_col text;
  v_rel record;
begin
  if p_limit is not null and p_limit < 0 then
    raise exception 'query_{t}: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_{t}: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.{t}', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_{t}: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_{t}: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {{"field": "popByPopId.nr"}}
        select * into v_rel from apflora.resolve_forward_relation('apflora.{t}', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_{t}: % is not a relation of apflora.{t}', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_{t}: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_{t}'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_{t}: apflora.q_{t} has no column %', v_col;
        end if;
        v_expr := format('t.%I', v_col);
      end if;

      v_order_parts := v_order_parts || array[
        v_expr || ' ' || v_dir ||
          case when v_nulls <> '' then ' nulls ' || v_nulls else '' end
      ];
    end loop;
  end if;

  return query execute format(
    'select t.* from apflora.q_{t} t join apflora.{t} tb on tb.id = t.id where (%s) order by %s%s%s',
    v_where,
    case
      when array_length(v_order_parts, 1) > 0
        then array_to_string(v_order_parts, ', ')
      else 't.id asc'
    end,
    case when p_limit is not null then format(' limit %s', p_limit) else '' end,
    case when p_offset is not null then format(' offset %s', p_offset) else '' end
  );
end
$fn$;
revoke execute on function apflora.query_{t}(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_{t}(jsonb, jsonb, integer, integer) to {grant};
'''

VIEW = '''create or replace view apflora.q_{t} with (security_invoker = true) as
  select
    t.*{extra}
  from apflora.{t} t;
grant select on apflora.q_{t} to {grant};
'''

out = ['''-- q_<table>: slim views for the query_<table> RPCs (phase 5): base
-- table + label (+ coordinate transforms). Deliberately WITHOUT the
-- heavy jsonb relation chains of the v_<table> form views.
-- query_<table>(p_filter, p_order, p_limit, p_offset): p_filter is the
-- jsonb the tree*GqlFilterAtom atoms emit (compiled by
-- apflora.compile_filter, see sql/postgrest/compileFilter.sql); the
-- relation constraint of the former XByYId embeds (e.g. tpopsByPopId)
-- is merged into the filter client-side as popByPopId.id equalTo.
-- Regenerate after schema changes:
--   python3 scripts/generate-query-rpcs.py
-- And afterwards: NOTIFY pgrst, 'reload schema';
BEGIN;
''']

for t in TABLES:
    extras = []
    if t in LABEL_TABLES:
        extras.append(f'apflora.{t}_label(t) AS label')
    if t == 'tpopmassn':
        # the tree label appends the zieleinheit werte text
        extras.append(
            '(select jsonb_build_object(\'text\', w.text)\n'
            '      from apflora.tpopkontrzaehl_einheit_werte w\n'
            '      where w.code = t.zieleinheit_einheit)\n'
            '      AS tpopkontrzaehl_einheit_werte_by_zieleinheit_einheit'
        )
    if t in GEO_TABLES:
        extras += [
            'public.lv95_x(t) AS lv95_x',
            'public.lv95_y(t) AS lv95_y',
            'public.wgs84_lat(t) AS wgs84_lat',
            'public.wgs84_long(t) AS wgs84_long',
        ]
    extra = (',\n    ' + ',\n    '.join(extras)) if extras else ''
    out.append(VIEW.format(t=t, extra=extra, grant=GRANT))
    out.append(f'drop function if exists apflora.query_{t}(jsonb, jsonb, integer, integer);')
    out.append(RPC.format(t=t, grant=GRANT))

out.append('COMMIT;')

with open('sql/postgrest/createQueryRpcs.sql', 'w') as f:
    f.write('\n'.join(out) + '\n')
print(f'generated {len(TABLES)} q_ views + RPCs')
