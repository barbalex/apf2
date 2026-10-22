-- Corrective migration for 0061, applied 2026-10-21 (same evening).
--
-- 1. beob was wrongly rewritten in 0061: beob.id holds ids owned by the
--    sources (Info Flora / Evab) and must never change. 0061's table list
--    was generated from "tables with local uuid defaults" and beob's
--    (inert) default made it slip in. This restores the source ids from
--    the old_id column 0061 had written, then drops that column.
--    Nothing references beob(id), so no FK cascade was involved.
--
-- 2. apflora.user uses column-level grants (see 0058). Those do not cover
--    the new old_id column, and PostGraphile's computed-label queries
--    select the whole row -> "permission denied for table user" for every
--    role after the graphql restart. Grant SELECT on old_id to the roles
--    that can read the other columns.

GRANT SELECT (old_id) ON apflora."user"
  TO anon, apflora_reader, apflora_ap_reader, apflora_ap_writer,
     apflora_freiwillig, apflora_manager;

BEGIN;

UPDATE apflora.beob
SET id = old_id;

ALTER TABLE apflora.beob DROP COLUMN old_id;

DO $$
BEGIN
  ASSERT (SELECT count(*) FROM apflora.beob WHERE substr(id::text, 15, 1) = '7') = 0,
    'beob still has v7 ids';
  ASSERT (SELECT count(*) FROM apflora.beob) = (SELECT count(DISTINCT id) FROM apflora.beob),
    'beob ids not unique';
END
$$;

COMMIT;
