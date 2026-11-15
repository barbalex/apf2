# shared list of SQL files both the dev and the production apply scripts
# run. Keep in sync with the latest migrations — scripts/apply-postgrest-sql.sh
# (dev) and scripts/apply-production-sql.sh source this.
FILES=(
  sql/migration/0063-postgrest-login.sql
  sql/migration/0064-views-security-invoker.sql
  sql/migration/0065-rpc-hardening.sql
  sql/apflora/migrations/2026-10-12_issue-823-ekf-passwort/00_grant_require_new_password.sql
  sql/apflora/migrations/2026-11-04_issue-835-login-password-enforcement/00_enforce_password_change_in_login.sql
  sql/apflora/migrations/2026-11-09_set-password-no-passless-claiming/00_close_passless_claiming.sql
  sql/apflora/migrations/2026-11-13_freiwillig-tpopkontr-rls/00_tighten.sql
  sql/apflora/migrations/2026-11-13_error-telemetry/00_error_report.sql
  sql/postgrest/createComputedViews.sql
  sql/postgrest/compileFilter.sql
  sql/postgrest/createQueryRpcs.sql
  sql/postgrest/createGetGemeinde.sql
  sql/postgrest/createKarteHelpers.sql
  sql/postgrest/createApberForYear.sql
  sql/postgrest/createApberForApFromAp.sql
  sql/postgrest/createApberChartsBulk.sql
)
