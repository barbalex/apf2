---
---

---

can we use https://github.com/pgrls/pgrls to test/analyze Postgres Row-Level Security?

resolved 2026-11-03: yes, as a local lint tool (pgrls.toml, run against
backend-dev; verify's tenant model does not fit our membership-subquery
policies). It found a real hole: 95 legacy views ran as owner postgres
and bypassed RLS (ap_reader saw all 600 aps via v_ap_anzkontr) — fixed
in sql/migration/0064-views-security-invoker.sql; all 26 api-tests and
testCompileFilter still pass. Remaining review backlog in its output:
5 SECURITY DEFINER functions with EXECUTE to PUBLIC (SEC042, incl.
encrypt_pass/set_password — needed by anon login, check owner/search_path)
and unpinned search_paths (SEC014/015). Also fixed invalid CHECK syntax
in sql/apflora/createTables.sql (user table, lines 642-643).

backlog done 2026-11-03 in sql/migration/0065-rpc-hardening.sql, applied
to dev and production (pgrls now clean: 0 errors, 0 warnings): pinned
search_path (pg_temp last) on all SECURITY DEFINER functions, revoked
PUBLIC's default EXECUTE on historize/historize_for_ap/
correct_vornach_beginnap_stati (anon could call them as rpc!), revoked
all EXECUTE on encrypt_pass (trigger-only), dropped duplicate qk writer
policy, hid require_new_password_on_next_login from anon. set_password
stays anon-executable: passless pre-provisioned accounts (18/91) cannot
log in, so it is their only onboarding path — meaning **anyone knowing a
passless username can claim the account**. If that worries us, move
onboarding to invite tokens (design decision pending).

---

---

I see there are still a few useCallback and useMemo (and others?) usages. Are they still needed considering this app uses react compiler?

---

---

---

---

---

use react-leaflet v2 (2.0.0-beta.2)? https://leafletjs.com/reference.html
We are using it in ps, migrated a few days ago. So far without hickups.
Biggest issue are bound to be the plugins:

- markercluster: move to https://github.com/KristjanESPERANTO/Leaflet.markercluster?
- react-leaflet: seemed to work well in ps
- leaflet-measure: no one touched it in years. Do we need to build our own version?
- leaflet-easyprint: same as measure?

---

Manual tests:

- Vertex-editing a drawn filter polygon
- cluster highlight states
- the unclustered assign-beob mode
- tpop-localization double-click
- and the non-OSM base layers/WMS overlays

---

When react-leaflet v6 (actively developed against beta.2 on the next branch) is published, you can drop the override, the patch script, and the shim in one go.
