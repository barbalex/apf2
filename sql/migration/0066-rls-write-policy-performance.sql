-- 0066: RLS write policies: constant-time grant checks
--
-- Problem (Charlotte Salzmann's ~3s lag on every EK save, Nov 2026):
-- the write policies checked ap_writer grants with
--   <key> IN (SELECT ... FROM tpop/pop JOIN ap_user WHERE user_name = current_user_name())
-- For a single-row UPDATE by primary key Postgres built the grant SET:
-- seq-scanning all ~21k tpop rows nested-looped against the user's granted
-- pops (10 mio join tests: ~850 ms for 6 grants, ~1.2 s for 44 grants on
-- the dev machine; worse on the production VM). The cost grew with the
-- user's number of ap_user grants AND with total row counts - which is why
-- the slowdown was account-specific (2025-12: "es ist das Login!!") and why
-- a fresh account with few grants felt fast, then regrew over a year.
-- The reader policies of tpop/pop nest INTO these subqueries (RLS
-- recursion), which pushed the planner into that shape.
--
-- Fix: SECURITY DEFINER probe helpers that walk OUTWARD from the written
-- row (pkey probes only, cost independent of grant count and table size):
--   apflora.current_user_granted_in_<ancestor>(<key>)
-- They are only used in WRITE policy expressions (WITH CHECK / USING of
-- writer_* policies and the WITH CHECK of the FOR ALL reader policies).
-- Read-side USING clauses stay byte-identical: bulk SELECTs keep the
-- hashable IN-subquery shape (no per-row function calls on exports).
--
-- Measured (dev machine, Nov-14 production backup):
--   UPDATE tpopkontr by id, chsalzmann (6 grants):  243 ms -> 5.6 ms
--   UPDATE tpopkontr by id, salzmann (44 grants):  1165 ms -> 3.2 ms
-- Semantics unchanged (api-tests green; forbidden writes still fail
-- loudly with the RLS check violation).
--
-- One deliberate fix: the LIVE pop_history reader policy compared
-- id (pop's pk) against ap ids - dead-wrong, but invisible (no
-- apflora_ap_reader users yet; history rows are written by historize as
-- superuser, bypassing RLS). The canonical createTables.sql version
-- (ap_id) is correct and is what this migration installs.
--
-- Apply as superuser (both apply scripts do) so the helpers own the bypass.

BEGIN;

-- 1. the helpers
CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_ap(p_ap_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.ap_user au
    WHERE au.ap_id = p_ap_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_for_art(p_art_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.apart apa
    JOIN apflora.ap_user au ON au.ap_id = apa.ap_id
    WHERE apa.art_id = p_art_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_pop(p_pop_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.pop p
    JOIN apflora.ap_user au ON au.ap_id = p.ap_id
    WHERE p.id = p_pop_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_tpop(p_tpop_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.tpop t
    JOIN apflora.pop p ON p.id = t.pop_id
    JOIN apflora.ap_user au ON au.ap_id = p.ap_id
    WHERE t.id = p_tpop_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_tpopkontr(p_tpopkontr_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.tpopkontr k
    JOIN apflora.tpop t ON t.id = k.tpop_id
    JOIN apflora.pop p ON p.id = t.pop_id
    JOIN apflora.ap_user au ON au.ap_id = p.ap_id
    WHERE k.id = p_tpopkontr_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_tpopmassn(p_tpopmassn_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.tpopmassn m
    JOIN apflora.tpop t ON t.id = m.tpop_id
    JOIN apflora.pop p ON p.id = t.pop_id
    JOIN apflora.ap_user au ON au.ap_id = p.ap_id
    WHERE m.id = p_tpopmassn_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_idealbiotop(p_idealbiotop_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.idealbiotop i
    JOIN apflora.ap_user au ON au.ap_id = i.ap_id
    WHERE i.id = p_idealbiotop_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_granted_in_pop_history(p_pop_history_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.pop_history ph
    JOIN apflora.ap_user au ON au.ap_id = ph.ap_id
    WHERE ph.id = p_pop_history_id
      AND au.user_name = public.current_user_name()
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

CREATE OR REPLACE FUNCTION apflora.current_user_owns_freiwkontr(p_tpopkontr_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO pg_catalog, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM apflora.tpopkontr k
    WHERE k.id = p_tpopkontr_id
      AND k.typ = 'Freiwilligen-Kontrolle'
      AND k.bearbeiter = (
        SELECT u.adresse_id FROM apflora."user" u
        WHERE u.name = public.current_user_name()
      )
  )
$$;
-- owned by a superuser: SECURITY DEFINER walks tpop/pop/ap_user without
-- their RLS policies nesting into every check (the very recursion that
-- made the original subqueries slow)

REVOKE EXECUTE ON FUNCTION
  apflora.current_user_granted_in_ap(uuid),
  apflora.current_user_granted_for_art(uuid),
  apflora.current_user_granted_in_pop(uuid),
  apflora.current_user_granted_in_tpop(uuid),
  apflora.current_user_granted_in_tpopkontr(uuid),
  apflora.current_user_granted_in_tpopmassn(uuid),
  apflora.current_user_granted_in_idealbiotop(uuid),
  apflora.current_user_granted_in_pop_history(uuid),
  apflora.current_user_owns_freiwkontr(uuid)
FROM PUBLIC, anon, authenticator;
GRANT EXECUTE ON FUNCTION
  apflora.current_user_granted_in_ap(uuid),
  apflora.current_user_granted_for_art(uuid),
  apflora.current_user_granted_in_pop(uuid),
  apflora.current_user_granted_in_tpop(uuid),
  apflora.current_user_granted_in_tpopkontr(uuid),
  apflora.current_user_granted_in_tpopmassn(uuid),
  apflora.current_user_granted_in_idealbiotop(uuid),
  apflora.current_user_granted_in_pop_history(uuid),
  apflora.current_user_owns_freiwkontr(uuid)
TO apflora_manager, apflora_ap_writer, apflora_ap_reader, apflora_reader, apflora_freiwillig;


-- 2. the policies (same names, same commands, same roles: only the write
--    expressions swap the grant subquery for the probe helpers)

DROP POLICY IF EXISTS reader ON apflora.ap;

CREATE POLICY reader ON apflora.ap
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_reader', 'apflora_ap_writer', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.ap_file;

CREATE POLICY reader ON apflora.ap_file
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.ap_history;

CREATE POLICY reader ON apflora.ap_history
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.apber;

CREATE POLICY reader ON apflora.apber
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.assozart;

CREATE POLICY reader ON apflora.assozart
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.erfkrit;

CREATE POLICY reader ON apflora.erfkrit
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.idealbiotop;

CREATE POLICY reader ON apflora.idealbiotop
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.idealbiotop_file;

CREATE POLICY reader ON apflora.idealbiotop_file
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND idealbiotop_id IN (
      SELECT idealbiotop.id
      FROM apflora.idealbiotop
       join apflora.ap_user on ap_user.ap_id = idealbiotop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_idealbiotop(idealbiotop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.pop;

CREATE POLICY reader ON apflora.pop
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.pop_file;

CREATE POLICY reader ON apflora.pop_file
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND pop_id IN (
      SELECT pop.id
      FROM apflora.pop
        inner join apflora.ap_user on ap_user.ap_id = pop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_pop(pop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.popber;

CREATE POLICY reader ON apflora.popber
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND pop_id IN (
      SELECT pop.id
      FROM apflora.pop
        inner join apflora.ap_user on ap_user.ap_id = pop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_pop(pop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.popmassnber;

CREATE POLICY reader ON apflora.popmassnber
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND pop_id IN (
      SELECT pop.id
      FROM apflora.pop
        inner join apflora.ap_user on ap_user.ap_id = pop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_pop(pop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpop;

CREATE POLICY reader ON apflora.tpop
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND pop_id IN (
      SELECT pop.id
      FROM apflora.pop
        inner join apflora.ap_user on ap_user.ap_id = pop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_pop(pop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpop_file;

CREATE POLICY reader ON apflora.tpop_file
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpop_id IN (
      SELECT tpop.id
      FROM apflora.tpop
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on ap_user.ap_id = pop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpop_history;

CREATE POLICY reader ON apflora.tpop_history
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND pop_id IN (
      SELECT pop_history.id
      FROM apflora.pop_history
        inner join apflora.ap_user on ap_user.ap_id = pop_history.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_pop_history(pop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpopber;

CREATE POLICY reader ON apflora.tpopber
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpop_id IN (
      SELECT tpop.id
      FROM apflora.tpop
        inner join apflora.pop on pop.id = tpop.pop_id
        inner join apflora.ap_user on ap_user.ap_id = pop.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS writer_insert ON apflora.tpopkontr;

CREATE POLICY writer_insert ON apflora.tpopkontr
FOR INSERT
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND typ = 'Freiwilligen-Kontrolle'
    AND (
      bearbeiter IS NULL
      OR bearbeiter = (
        SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
      )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS writer_update ON apflora.tpopkontr;

CREATE POLICY writer_update ON apflora.tpopkontr
FOR UPDATE
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_ap_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND typ = 'Freiwilligen-Kontrolle'
    AND bearbeiter = (
      SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS writer_delete ON apflora.tpopkontr;

CREATE POLICY writer_delete ON apflora.tpopkontr
FOR DELETE
USING (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND typ = 'Freiwilligen-Kontrolle'
    AND bearbeiter = (
      SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS writer_insert ON apflora.tpopkontr_file;

CREATE POLICY writer_insert ON apflora.tpopkontr_file
FOR INSERT
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND apflora.current_user_owns_freiwkontr(tpopkontr_id)
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
);
DROP POLICY IF EXISTS writer_update ON apflora.tpopkontr_file;

CREATE POLICY writer_update ON apflora.tpopkontr_file
FOR UPDATE
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND apflora.current_user_owns_freiwkontr(tpopkontr_id)
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
);
DROP POLICY IF EXISTS writer_delete ON apflora.tpopkontr_file;

CREATE POLICY writer_delete ON apflora.tpopkontr_file
FOR DELETE
USING (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND apflora.current_user_owns_freiwkontr(tpopkontr_id)
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
);
DROP POLICY IF EXISTS writer_insert ON apflora.tpopkontrzaehl;

CREATE POLICY writer_insert ON apflora.tpopkontrzaehl
FOR INSERT
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND apflora.current_user_owns_freiwkontr(tpopkontr_id)
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
);
DROP POLICY IF EXISTS writer_update ON apflora.tpopkontrzaehl;

CREATE POLICY writer_update ON apflora.tpopkontrzaehl
FOR UPDATE
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND apflora.current_user_owns_freiwkontr(tpopkontr_id)
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
);
DROP POLICY IF EXISTS writer_delete ON apflora.tpopkontrzaehl;

CREATE POLICY writer_delete ON apflora.tpopkontrzaehl
FOR DELETE
USING (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND apflora.current_user_owns_freiwkontr(tpopkontr_id)
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopkontr(tpopkontr_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpopmassn;

CREATE POLICY reader ON apflora.tpopmassn
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpop_id IN (
      SELECT tpop.id
      FROM apflora.tpop
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpopmassn_file;

CREATE POLICY reader ON apflora.tpopmassn_file
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpopmassn_id IN (
      SELECT tpopmassn.id
      FROM apflora.tpopmassn
        inner join apflora.tpop on tpopmassn.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpopmassn(tpopmassn_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.tpopmassnber;

CREATE POLICY reader ON apflora.tpopmassnber
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpop_id IN (
      SELECT tpop.id
      FROM apflora.tpop
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.ziel;

CREATE POLICY reader ON apflora.ziel
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.beob;

CREATE POLICY reader ON apflora.beob
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND art_id IN (
      SELECT apart.art_id
      FROM apflora.apart
        inner join apflora.ap_user on ap_user.ap_id = apart.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_for_art(art_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.apart;

CREATE POLICY reader ON apflora.apart
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND ap_id IN (
      SELECT ap_id
      FROM apflora.ap_user
      WHERE user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);
DROP POLICY IF EXISTS writer ON apflora.ekplan;

CREATE POLICY writer ON apflora.ekplan
USING (TRUE)
WITH CHECK (
  CURRENT_USER = 'apflora_manager'
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_tpop(tpop_id)
  )
);
DROP POLICY IF EXISTS reader ON apflora.apqk;

CREATE POLICY reader ON apflora.apqk
USING (TRUE)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND apflora.current_user_granted_in_ap(ap_id)
  )
);

COMMIT;
