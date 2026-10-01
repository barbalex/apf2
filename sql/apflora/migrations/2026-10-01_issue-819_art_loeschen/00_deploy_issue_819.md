# Deploy the fix for issue 819

Closes https://github.com/barbalex/apf2/issues/819:
deleting an art ("Art löschen") failed with

    update or delete on table "ap" violates foreign key constraint
    "fk_pop_history_ap" on table "pop_history"

because the yearly snapshots in the history tables were not deleted
with the art. Now deletion is propagated through foreign keys:

    ap -> ap_history -> pop_history -> tpop_history   (all ON DELETE CASCADE)

Also fixes the same failure when deleting a single ap_history year
("Historien" form): pop_history/tpop_history of that year cascade now.

No data loss beyond what deletion implies: the migration removes
3 orphaned ap_history rows from 2021 - snapshots of arts that were
deleted back then without their history (none are reachable in the UI
because their art is gone, no pop_history references them).

1. run the migration:
   - 01_propagate_ap_deletion_to_history.sql
2. restart the graphql server (the GraphQL schema gains the new
   ap_history -> ap relation):
     docker compose up -d graphql
3. re-dump the schema and regenerate typed operations:
     npm run codegen:schema
     npm run codegen
4. test:
   - delete an art with populations and existing history:
     it disappears including "Historien", "Populationen" and
     "Teil-Populationen" histories
   - delete a single year in the "Historien" form of an art:
     the populations' histories of that year disappear with it
