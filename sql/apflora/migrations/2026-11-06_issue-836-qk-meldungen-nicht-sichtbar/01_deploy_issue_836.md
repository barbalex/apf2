# Deploy the apflora.user table-level SELECT to the live server

Closes #836 ("Meldungen Qualitätskontrolle nicht sichtbar"). Reproduced
on the dev stack (2026-11-06) with Karin Sartori's account (sartori,
apflora_ap_writer):

- `GET /postgrest/q_user?select=id&limit=1` as apflora_ap_writer
  → `42501 permission denied for table user`; as apflora_manager → 200.
- In the app the whole /Daten workspace (tree, forms, hence
  Qualitätskontrollen) is replaced by the error overlay
  "Sorry, ein Fehler ist aufgetreten: permission denied for table user".
- Managers keep working because they hold table-level SELECT on
  apflora."user" - which is why only ap-writer accounts are affected.

Cause: q_user / v_user / query_user and user_label() evaluate the whole
row of apflora."user"; the column-level grants of the other roles are
missing old_id (added by 0061/0062 and repeatedly stripped again by the
REVOKE + column-list re-grants, e.g. 03_post_restore.sql). Same class as
#825, whose migration already stated the invariant: every role needs
SELECT on EVERY column.

## Steps

1. run the migration on the live server:
   - `00_grant_user_table_select.sql`
2. verify as a non-manager account (must be 200, not 42501):
   `curl 'https://api.apflora.ch/postgrest/q_user?select=id&limit=1' -H "Authorization: Bearer <ap-writer-token>"`
3. verify in the app: log in as an ap-writer, open
   Daten → Art → Qualitätskontrollen - the tree loads and the messages
   appear.
