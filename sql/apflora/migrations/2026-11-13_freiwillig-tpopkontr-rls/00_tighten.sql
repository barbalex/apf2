-- Tighten apflora_freiwillig writes on the EKF tables
-- (tpopkontr, tpopkontrzaehl, tpopkontr_file):
-- before, the single reader policy's WITH CHECK let volunteers write ANY
-- row of these tables — including professional Kontrollen ('Kontrolle' /
-- 'Ausgangszustand') and their zaehl/file children. DELETE was not
-- restricted at all (WITH CHECK never applies to it). Now (owner
-- decision 2026-11-13):
-- - SELECT visibility is unchanged (all app roles see all rows)
-- - apflora_freiwillig may UPDATE/DELETE only rows of Freiwilligen-
--   Kontrollen assigned to them (bearbeiter = the adresse of their user
--   account); child-table rows follow their tpopkontr
-- - apflora_freiwillig may INSERT only Freiwilligen-Kontrollen, with
--   bearbeiter still NULL (the app creates them unassigned) or their own
-- - UPDATE keeps a broad USING (restriction in WITH CHECK) so forbidden
--   updates fail loudly with 403; forbidden DELETEs are silent no-ops
-- - apflora_manager and apflora_ap_writer are unaffected
-- Mirrors the policy blocks in sql/apflora/createTables.sql

DROP POLICY IF EXISTS reader ON apflora.tpopkontr;
DROP POLICY IF EXISTS writer_insert ON apflora.tpopkontr;
DROP POLICY IF EXISTS writer_update ON apflora.tpopkontr;
DROP POLICY IF EXISTS writer_delete ON apflora.tpopkontr;

-- read visibility: unchanged (all app roles see all kontrollen, ap_reader
-- only those of its assigned aps)
CREATE POLICY reader ON apflora.tpopkontr
FOR SELECT
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
);

-- writes: apflora_freiwillig only touches ITS OWN Freiwilligen-Kontrollen
-- (bearbeiter = the adresse of the logged-in account). New ones may be
-- created while bearbeiter is still unset — but only ever as
-- Freiwilligen-Kontrolle. Professionals stay unrestricted (manager
-- everywhere, ap_writer within its assigned aps).
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
    AND tpop_id IN (
      select tpop.id 
      from apflora.tpop 
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      where ap_user.user_name = current_user_name()
    )
  )
);

-- UPDATE keeps the broad USING so that forbidden updates fail loudly (403
-- from the WITH CHECK) instead of silently updating zero rows. DELETE can
-- only be restricted via USING — forbidden deletes are silent no-ops.
CREATE POLICY writer_update ON apflora.tpopkontr
FOR UPDATE
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_ap_reader', 'apflora_freiwillig')
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
    AND tpop_id IN (
      select tpop.id 
      from apflora.tpop 
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      where ap_user.user_name = current_user_name()
    )
  )
);

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
    AND tpop_id IN (
      select tpop.id 
      from apflora.tpop 
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      where ap_user.user_name = current_user_name()
    )
  )
);

DROP POLICY IF EXISTS reader ON apflora.tpopkontr_file;
DROP POLICY IF EXISTS writer_insert ON apflora.tpopkontr_file;
DROP POLICY IF EXISTS writer_update ON apflora.tpopkontr_file;
DROP POLICY IF EXISTS writer_delete ON apflora.tpopkontr_file;

-- read visibility: unchanged
CREATE POLICY reader ON apflora.tpopkontr_file
FOR SELECT
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

-- writes: apflora_freiwillig only for rows of its OWN Freiwilligen-Kontrollen
-- (see the tpopkontr policies). UPDATE keeps the broad USING so forbidden
-- updates fail loudly (403); DELETE can only be restricted via USING —
-- forbidden deletes are silent no-ops.
CREATE POLICY writer_insert ON apflora.tpopkontr_file
FOR INSERT
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND tpopkontr_id IN (
      SELECT k.id FROM apflora.tpopkontr k
      WHERE k.typ = 'Freiwilligen-Kontrolle'
        AND k.bearbeiter = (
          SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
        )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

CREATE POLICY writer_update ON apflora.tpopkontr_file
FOR UPDATE
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND tpopkontr_id IN (
      SELECT k.id FROM apflora.tpopkontr k
      WHERE k.typ = 'Freiwilligen-Kontrolle'
        AND k.bearbeiter = (
          SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
        )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

CREATE POLICY writer_delete ON apflora.tpopkontr_file
FOR DELETE
USING (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND tpopkontr_id IN (
      SELECT k.id FROM apflora.tpopkontr k
      WHERE k.typ = 'Freiwilligen-Kontrolle'
        AND k.bearbeiter = (
          SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
        )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

DROP POLICY IF EXISTS reader ON apflora.tpopkontrzaehl;
DROP POLICY IF EXISTS writer_insert ON apflora.tpopkontrzaehl;
DROP POLICY IF EXISTS writer_update ON apflora.tpopkontrzaehl;
DROP POLICY IF EXISTS writer_delete ON apflora.tpopkontrzaehl;

-- read visibility: unchanged
CREATE POLICY reader ON apflora.tpopkontrzaehl
FOR SELECT
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

-- writes: apflora_freiwillig only for rows of its OWN Freiwilligen-Kontrollen
-- (see the tpopkontr policies). UPDATE keeps the broad USING so forbidden
-- updates fail loudly (403); DELETE can only be restricted via USING —
-- forbidden deletes are silent no-ops.
CREATE POLICY writer_insert ON apflora.tpopkontrzaehl
FOR INSERT
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND tpopkontr_id IN (
      SELECT k.id FROM apflora.tpopkontr k
      WHERE k.typ = 'Freiwilligen-Kontrolle'
        AND k.bearbeiter = (
          SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
        )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

CREATE POLICY writer_update ON apflora.tpopkontrzaehl
FOR UPDATE
USING (
  CURRENT_USER IN ('apflora_manager', 'apflora_ap_writer', 'apflora_reader', 'apflora_freiwillig')
  OR (
    CURRENT_USER IN ('apflora_ap_reader') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
)
WITH CHECK (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND tpopkontr_id IN (
      SELECT k.id FROM apflora.tpopkontr k
      WHERE k.typ = 'Freiwilligen-Kontrolle'
        AND k.bearbeiter = (
          SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
        )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);

CREATE POLICY writer_delete ON apflora.tpopkontrzaehl
FOR DELETE
USING (
  CURRENT_USER IN ('apflora_manager')
  OR (
    CURRENT_USER IN ('apflora_freiwillig')
    AND tpopkontr_id IN (
      SELECT k.id FROM apflora.tpopkontr k
      WHERE k.typ = 'Freiwilligen-Kontrolle'
        AND k.bearbeiter = (
          SELECT u.adresse_id FROM apflora."user" u WHERE u.name = current_user_name()
        )
    )
  )
  OR (
    CURRENT_USER IN ('apflora_ap_writer') 
    AND tpopkontr_id IN (
      SELECT tpopkontr.id
      FROM apflora.tpopkontr
        inner join apflora.tpop on tpopkontr.tpop_id = tpop.id
        inner join apflora.pop on tpop.pop_id = pop.id
        inner join apflora.ap_user on pop.ap_id = ap_user.ap_id
      WHERE ap_user.user_name = current_user_name()
    )
  )
);
