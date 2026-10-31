-- q_<table>: slim views for the query_<table> RPCs (phase 5): base
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

create or replace view apflora.q_ap with (security_invoker = true) as
  select
    t.*,
    apflora.ap_label(t) AS label
  from apflora.ap t;
grant select on apflora.q_ap to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_ap(jsonb, jsonb, integer, integer);
create or replace function apflora.query_ap(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_ap
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
    raise exception 'query_ap: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_ap: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.ap', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_ap: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_ap: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.ap', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_ap: % is not a relation of apflora.ap', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ap: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_ap'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ap: apflora.q_ap has no column %', v_col;
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
    'select t.* from apflora.q_ap t join apflora.ap tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_ap(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_ap(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_apart with (security_invoker = true) as
  select
    t.*,
    apflora.apart_label(t) AS label
  from apflora.apart t;
grant select on apflora.q_apart to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_apart(jsonb, jsonb, integer, integer);
create or replace function apflora.query_apart(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_apart
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
    raise exception 'query_apart: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_apart: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.apart', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_apart: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_apart: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.apart', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_apart: % is not a relation of apflora.apart', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_apart: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_apart'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_apart: apflora.q_apart has no column %', v_col;
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
    'select t.* from apflora.q_apart t join apflora.apart tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_apart(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_apart(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_apber with (security_invoker = true) as
  select
    t.*,
    apflora.apber_label(t) AS label
  from apflora.apber t;
grant select on apflora.q_apber to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_apber(jsonb, jsonb, integer, integer);
create or replace function apflora.query_apber(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_apber
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
    raise exception 'query_apber: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_apber: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.apber', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_apber: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_apber: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.apber', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_apber: % is not a relation of apflora.apber', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_apber: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_apber'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_apber: apflora.q_apber has no column %', v_col;
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
    'select t.* from apflora.q_apber t join apflora.apber tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_apber(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_apber(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_apberuebersicht with (security_invoker = true) as
  select
    t.*,
    apflora.apberuebersicht_label(t) AS label
  from apflora.apberuebersicht t;
grant select on apflora.q_apberuebersicht to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_apberuebersicht(jsonb, jsonb, integer, integer);
create or replace function apflora.query_apberuebersicht(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_apberuebersicht
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
    raise exception 'query_apberuebersicht: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_apberuebersicht: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.apberuebersicht', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_apberuebersicht: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_apberuebersicht: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.apberuebersicht', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_apberuebersicht: % is not a relation of apflora.apberuebersicht', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_apberuebersicht: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_apberuebersicht'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_apberuebersicht: apflora.q_apberuebersicht has no column %', v_col;
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
    'select t.* from apflora.q_apberuebersicht t join apflora.apberuebersicht tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_apberuebersicht(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_apberuebersicht(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_assozart with (security_invoker = true) as
  select
    t.*,
    apflora.assozart_label(t) AS label
  from apflora.assozart t;
grant select on apflora.q_assozart to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_assozart(jsonb, jsonb, integer, integer);
create or replace function apflora.query_assozart(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_assozart
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
    raise exception 'query_assozart: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_assozart: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.assozart', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_assozart: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_assozart: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.assozart', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_assozart: % is not a relation of apflora.assozart', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_assozart: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_assozart'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_assozart: apflora.q_assozart has no column %', v_col;
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
    'select t.* from apflora.q_assozart t join apflora.assozart tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_assozart(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_assozart(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_adresse with (security_invoker = true) as
  select
    t.*,
    apflora.adresse_label(t) AS label
  from apflora.adresse t;
grant select on apflora.q_adresse to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_adresse(jsonb, jsonb, integer, integer);
create or replace function apflora.query_adresse(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_adresse
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
    raise exception 'query_adresse: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_adresse: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.adresse', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_adresse: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_adresse: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.adresse', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_adresse: % is not a relation of apflora.adresse', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_adresse: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_adresse'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_adresse: apflora.q_adresse has no column %', v_col;
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
    'select t.* from apflora.q_adresse t join apflora.adresse tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_adresse(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_adresse(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_beob with (security_invoker = true) as
  select
    t.*,
    apflora.beob_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  from apflora.beob t;
grant select on apflora.q_beob to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_beob(jsonb, jsonb, integer, integer);
create or replace function apflora.query_beob(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_beob
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
    raise exception 'query_beob: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_beob: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.beob', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_beob: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_beob: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.beob', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_beob: % is not a relation of apflora.beob', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_beob: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_beob'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_beob: apflora.q_beob has no column %', v_col;
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
    'select t.* from apflora.q_beob t join apflora.beob tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_beob(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_beob(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_ek_abrechnungstyp_werte with (security_invoker = true) as
  select
    t.*,
    apflora.ek_abrechnungstyp_werte_label(t) AS label
  from apflora.ek_abrechnungstyp_werte t;
grant select on apflora.q_ek_abrechnungstyp_werte to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_ek_abrechnungstyp_werte(jsonb, jsonb, integer, integer);
create or replace function apflora.query_ek_abrechnungstyp_werte(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_ek_abrechnungstyp_werte
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
    raise exception 'query_ek_abrechnungstyp_werte: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_ek_abrechnungstyp_werte: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.ek_abrechnungstyp_werte', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_ek_abrechnungstyp_werte: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_ek_abrechnungstyp_werte: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.ek_abrechnungstyp_werte', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_ek_abrechnungstyp_werte: % is not a relation of apflora.ek_abrechnungstyp_werte', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ek_abrechnungstyp_werte: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_ek_abrechnungstyp_werte'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ek_abrechnungstyp_werte: apflora.q_ek_abrechnungstyp_werte has no column %', v_col;
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
    'select t.* from apflora.q_ek_abrechnungstyp_werte t join apflora.ek_abrechnungstyp_werte tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_ek_abrechnungstyp_werte(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_ek_abrechnungstyp_werte(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_ekfrequenz with (security_invoker = true) as
  select
    t.*
  from apflora.ekfrequenz t;
grant select on apflora.q_ekfrequenz to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_ekfrequenz(jsonb, jsonb, integer, integer);
create or replace function apflora.query_ekfrequenz(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_ekfrequenz
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
    raise exception 'query_ekfrequenz: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_ekfrequenz: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.ekfrequenz', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_ekfrequenz: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_ekfrequenz: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.ekfrequenz', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_ekfrequenz: % is not a relation of apflora.ekfrequenz', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ekfrequenz: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_ekfrequenz'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ekfrequenz: apflora.q_ekfrequenz has no column %', v_col;
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
    'select t.* from apflora.q_ekfrequenz t join apflora.ekfrequenz tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_ekfrequenz(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_ekfrequenz(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_ekzaehleinheit with (security_invoker = true) as
  select
    t.*,
    apflora.ekzaehleinheit_label(t) AS label
  from apflora.ekzaehleinheit t;
grant select on apflora.q_ekzaehleinheit to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_ekzaehleinheit(jsonb, jsonb, integer, integer);
create or replace function apflora.query_ekzaehleinheit(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_ekzaehleinheit
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
    raise exception 'query_ekzaehleinheit: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_ekzaehleinheit: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.ekzaehleinheit', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_ekzaehleinheit: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_ekzaehleinheit: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.ekzaehleinheit', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_ekzaehleinheit: % is not a relation of apflora.ekzaehleinheit', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ekzaehleinheit: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_ekzaehleinheit'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ekzaehleinheit: apflora.q_ekzaehleinheit has no column %', v_col;
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
    'select t.* from apflora.q_ekzaehleinheit t join apflora.ekzaehleinheit tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_ekzaehleinheit(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_ekzaehleinheit(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_erfkrit with (security_invoker = true) as
  select
    t.*,
    apflora.erfkrit_label(t) AS label
  from apflora.erfkrit t;
grant select on apflora.q_erfkrit to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_erfkrit(jsonb, jsonb, integer, integer);
create or replace function apflora.query_erfkrit(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_erfkrit
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
    raise exception 'query_erfkrit: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_erfkrit: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.erfkrit', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_erfkrit: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_erfkrit: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.erfkrit', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_erfkrit: % is not a relation of apflora.erfkrit', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_erfkrit: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_erfkrit'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_erfkrit: apflora.q_erfkrit has no column %', v_col;
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
    'select t.* from apflora.q_erfkrit t join apflora.erfkrit tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_erfkrit(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_erfkrit(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_pop with (security_invoker = true) as
  select
    t.*,
    apflora.pop_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  from apflora.pop t;
grant select on apflora.q_pop to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_pop(jsonb, jsonb, integer, integer);
create or replace function apflora.query_pop(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_pop
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
    raise exception 'query_pop: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_pop: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.pop', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_pop: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_pop: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.pop', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_pop: % is not a relation of apflora.pop', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_pop: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_pop'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_pop: apflora.q_pop has no column %', v_col;
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
    'select t.* from apflora.q_pop t join apflora.pop tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_pop(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_pop(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_popber with (security_invoker = true) as
  select
    t.*,
    apflora.popber_label(t) AS label
  from apflora.popber t;
grant select on apflora.q_popber to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_popber(jsonb, jsonb, integer, integer);
create or replace function apflora.query_popber(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_popber
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
    raise exception 'query_popber: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_popber: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.popber', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_popber: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_popber: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.popber', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_popber: % is not a relation of apflora.popber', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_popber: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_popber'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_popber: apflora.q_popber has no column %', v_col;
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
    'select t.* from apflora.q_popber t join apflora.popber tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_popber(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_popber(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_popmassnber with (security_invoker = true) as
  select
    t.*,
    apflora.popmassnber_label(t) AS label
  from apflora.popmassnber t;
grant select on apflora.q_popmassnber to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_popmassnber(jsonb, jsonb, integer, integer);
create or replace function apflora.query_popmassnber(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_popmassnber
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
    raise exception 'query_popmassnber: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_popmassnber: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.popmassnber', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_popmassnber: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_popmassnber: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.popmassnber', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_popmassnber: % is not a relation of apflora.popmassnber', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_popmassnber: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_popmassnber'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_popmassnber: apflora.q_popmassnber has no column %', v_col;
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
    'select t.* from apflora.q_popmassnber t join apflora.popmassnber tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_popmassnber(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_popmassnber(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpop with (security_invoker = true) as
  select
    t.*,
    apflora.tpop_label(t) AS label,
    public.lv95_x(t) AS lv95_x,
    public.lv95_y(t) AS lv95_y,
    public.wgs84_lat(t) AS wgs84_lat,
    public.wgs84_long(t) AS wgs84_long
  from apflora.tpop t;
grant select on apflora.q_tpop to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpop(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpop(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpop
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
    raise exception 'query_tpop: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpop: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpop', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpop: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpop: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpop', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpop: % is not a relation of apflora.tpop', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpop: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpop'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpop: apflora.q_tpop has no column %', v_col;
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
    'select t.* from apflora.q_tpop t join apflora.tpop tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpop(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpop(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpop_apberrelevant_grund_werte with (security_invoker = true) as
  select
    t.*,
    apflora.tpop_apberrelevant_grund_werte_label(t) AS label
  from apflora.tpop_apberrelevant_grund_werte t;
grant select on apflora.q_tpop_apberrelevant_grund_werte to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpop_apberrelevant_grund_werte(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpop_apberrelevant_grund_werte(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpop_apberrelevant_grund_werte
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
    raise exception 'query_tpop_apberrelevant_grund_werte: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpop_apberrelevant_grund_werte: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpop_apberrelevant_grund_werte', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpop_apberrelevant_grund_werte: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpop_apberrelevant_grund_werte: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpop_apberrelevant_grund_werte', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpop_apberrelevant_grund_werte: % is not a relation of apflora.tpop_apberrelevant_grund_werte', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpop_apberrelevant_grund_werte: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpop_apberrelevant_grund_werte'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpop_apberrelevant_grund_werte: apflora.q_tpop_apberrelevant_grund_werte has no column %', v_col;
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
    'select t.* from apflora.q_tpop_apberrelevant_grund_werte t join apflora.tpop_apberrelevant_grund_werte tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpop_apberrelevant_grund_werte(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpop_apberrelevant_grund_werte(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpopber with (security_invoker = true) as
  select
    t.*,
    apflora.tpopber_label(t) AS label
  from apflora.tpopber t;
grant select on apflora.q_tpopber to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpopber(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpopber(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpopber
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
    raise exception 'query_tpopber: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpopber: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpopber', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpopber: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpopber: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpopber', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpopber: % is not a relation of apflora.tpopber', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopber: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpopber'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopber: apflora.q_tpopber has no column %', v_col;
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
    'select t.* from apflora.q_tpopber t join apflora.tpopber tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpopber(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpopber(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpopkontr with (security_invoker = true) as
  select
    t.*,
    apflora.tpopkontr_label_ek(t) AS label_ek,
    apflora.tpopkontr_label_ekf(t) AS label_ekf
  from apflora.tpopkontr t;
grant select on apflora.q_tpopkontr to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpopkontr(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpopkontr(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpopkontr
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
    raise exception 'query_tpopkontr: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpopkontr: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpopkontr', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpopkontr: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpopkontr: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpopkontr', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpopkontr: % is not a relation of apflora.tpopkontr', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopkontr: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpopkontr'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopkontr: apflora.q_tpopkontr has no column %', v_col;
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
    'select t.* from apflora.q_tpopkontr t join apflora.tpopkontr tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpopkontr(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpopkontr(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpopkontrzaehl with (security_invoker = true) as
  select
    t.*,
    apflora.tpopkontrzaehl_label(t) AS label
  from apflora.tpopkontrzaehl t;
grant select on apflora.q_tpopkontrzaehl to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpopkontrzaehl(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpopkontrzaehl(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpopkontrzaehl
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
    raise exception 'query_tpopkontrzaehl: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpopkontrzaehl: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpopkontrzaehl', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpopkontrzaehl: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpopkontrzaehl: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpopkontrzaehl', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpopkontrzaehl: % is not a relation of apflora.tpopkontrzaehl', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopkontrzaehl: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpopkontrzaehl'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopkontrzaehl: apflora.q_tpopkontrzaehl has no column %', v_col;
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
    'select t.* from apflora.q_tpopkontrzaehl t join apflora.tpopkontrzaehl tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpopkontrzaehl(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpopkontrzaehl(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpopkontrzaehl_einheit_werte with (security_invoker = true) as
  select
    t.*,
    apflora.tpopkontrzaehl_einheit_werte_label(t) AS label
  from apflora.tpopkontrzaehl_einheit_werte t;
grant select on apflora.q_tpopkontrzaehl_einheit_werte to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpopkontrzaehl_einheit_werte(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpopkontrzaehl_einheit_werte(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpopkontrzaehl_einheit_werte
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
    raise exception 'query_tpopkontrzaehl_einheit_werte: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpopkontrzaehl_einheit_werte: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpopkontrzaehl_einheit_werte', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpopkontrzaehl_einheit_werte: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpopkontrzaehl_einheit_werte: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpopkontrzaehl_einheit_werte', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpopkontrzaehl_einheit_werte: % is not a relation of apflora.tpopkontrzaehl_einheit_werte', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopkontrzaehl_einheit_werte: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpopkontrzaehl_einheit_werte'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopkontrzaehl_einheit_werte: apflora.q_tpopkontrzaehl_einheit_werte has no column %', v_col;
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
    'select t.* from apflora.q_tpopkontrzaehl_einheit_werte t join apflora.tpopkontrzaehl_einheit_werte tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpopkontrzaehl_einheit_werte(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpopkontrzaehl_einheit_werte(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpopmassn with (security_invoker = true) as
  select
    t.*,
    apflora.tpopmassn_label(t) AS label,
    (select jsonb_build_object('text', w.text)
      from apflora.tpopkontrzaehl_einheit_werte w
      where w.code = t.zieleinheit_einheit)
      AS tpopkontrzaehl_einheit_werte_by_zieleinheit_einheit
  from apflora.tpopmassn t;
grant select on apflora.q_tpopmassn to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpopmassn(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpopmassn(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpopmassn
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
    raise exception 'query_tpopmassn: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpopmassn: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpopmassn', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpopmassn: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpopmassn: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpopmassn', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpopmassn: % is not a relation of apflora.tpopmassn', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopmassn: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpopmassn'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopmassn: apflora.q_tpopmassn has no column %', v_col;
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
    'select t.* from apflora.q_tpopmassn t join apflora.tpopmassn tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpopmassn(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpopmassn(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_tpopmassnber with (security_invoker = true) as
  select
    t.*,
    apflora.tpopmassnber_label(t) AS label
  from apflora.tpopmassnber t;
grant select on apflora.q_tpopmassnber to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_tpopmassnber(jsonb, jsonb, integer, integer);
create or replace function apflora.query_tpopmassnber(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_tpopmassnber
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
    raise exception 'query_tpopmassnber: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_tpopmassnber: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.tpopmassnber', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_tpopmassnber: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_tpopmassnber: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.tpopmassnber', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_tpopmassnber: % is not a relation of apflora.tpopmassnber', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopmassnber: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_tpopmassnber'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_tpopmassnber: apflora.q_tpopmassnber has no column %', v_col;
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
    'select t.* from apflora.q_tpopmassnber t join apflora.tpopmassnber tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_tpopmassnber(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_tpopmassnber(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_user with (security_invoker = true) as
  select
    t.*,
    apflora.user_label(t) AS label
  from apflora.user t;
grant select on apflora.q_user to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_user(jsonb, jsonb, integer, integer);
create or replace function apflora.query_user(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_user
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
    raise exception 'query_user: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_user: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.user', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_user: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_user: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.user', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_user: % is not a relation of apflora.user', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_user: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_user'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_user: apflora.q_user has no column %', v_col;
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
    'select t.* from apflora.q_user t join apflora.user tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_user(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_user(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

create or replace view apflora.q_ziel with (security_invoker = true) as
  select
    t.*,
    apflora.ziel_label(t) AS label
  from apflora.ziel t;
grant select on apflora.q_ziel to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

drop function if exists apflora.query_ziel(jsonb, jsonb, integer, integer);
create or replace function apflora.query_ziel(p_filter jsonb default null, p_order jsonb default null, p_limit integer default null, p_offset integer default null)
returns setof apflora.q_ziel
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
    raise exception 'query_ziel: p_limit must be >= 0';
  end if;
  if p_offset is not null and p_offset < 0 then
    raise exception 'query_ziel: p_offset must be >= 0';
  end if;

  -- compiled against the BASE table alias tb: relations resolve from the
  -- base FKs and the label functions take the base rowtype (view rowtypes
  -- would not match)
  v_where := apflora.compile_filter('apflora.ziel', 'tb', p_filter);

  if p_order is not null and jsonb_typeof(p_order) = 'array' then
    for v_item in select * from jsonb_array_elements(p_order) loop
      v_field := v_item->>'field';
      v_dir := lower(coalesce(v_item->>'dir', 'asc'));
      v_nulls := lower(coalesce(v_item->>'nulls', ''));
      if v_dir not in ('asc', 'desc') then
        raise exception 'query_ziel: bad dir "%"', v_dir;
      end if;
      if v_nulls not in ('', 'first', 'last') then
        raise exception 'query_ziel: bad nulls "%"', v_nulls;
      end if;

      if v_field = 'label' then
        -- the q_ views expose label as a regular column
        v_expr := 't.label';
      elsif position('.' in v_field) > 0 then
        -- order by a parent column: {"field": "popByPopId.nr"}
        select * into v_rel from apflora.resolve_forward_relation('apflora.ziel', split_part(v_field, '.', 1));
        if not found then
          raise exception 'query_ziel: % is not a relation of apflora.ziel', split_part(v_field, '.', 1);
        end if;
        v_col := apflora.camel_to_snake(split_part(v_field, '.', 2));
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = v_rel.parent_table::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ziel: % has no column %', v_rel.parent_table, v_col;
        end if;
        v_expr := format('(select r.%I from %s r where r.%I = tb.%I)',
          v_col, v_rel.parent_table, v_rel.parent_col, v_rel.child_col);
      else
        v_col := apflora.camel_to_snake(v_field);
        if not exists (
          select 1 from pg_attribute a
          where a.attrelid = 'apflora.q_ziel'::regclass
            and a.attname = v_col and a.attnum > 0 and not a.attisdropped
        ) then
          raise exception 'query_ziel: apflora.q_ziel has no column %', v_col;
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
    'select t.* from apflora.q_ziel t join apflora.ziel tb on tb.id = t.id where (%s) order by %s%s%s',
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
revoke execute on function apflora.query_ziel(jsonb, jsonb, integer, integer) from public;
grant execute on function apflora.query_ziel(jsonb, jsonb, integer, integer) to apflora_reader, apflora_ap_reader, apflora_ap_writer, apflora_manager, apflora_freiwillig;

COMMIT;
