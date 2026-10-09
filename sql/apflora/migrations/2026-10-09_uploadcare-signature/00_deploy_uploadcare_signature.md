# Deploy the Uploadcare server-side signature to the live server

Closes the exposure of the Uploadcare secret key: the frontend
computed md5(VITE_UPLOADCARE_SECRET_KEY + expire) in the browser,
so the secret was shipped in every bundle (and lives on in cached
bundles and service-worker caches). The GraphQL function
apflora.upload_signature() (granted to logged-in roles only, revoked
from anon) now provides the signature. The secret lives in the
database setting app.uploadcare_secret.

1. run this migration:
   - 01_create_upload_signature.sql
     (type + function + grants)
2. on the server database, set the secret key (NOT in a migration
   file - it is environment specific):
     docker exec apf_db psql -U postgres -d apflora -c \
       "ALTER DATABASE apflora SET app.uploadcare_secret TO '<secret key>';"
   careful: no trailing whitespace/CR. verify with:
     docker exec apf_db psql -U postgres -d apflora -Atc \
       "SELECT length(current_setting('app.uploadcare_secret'));"
3. in backend/.env add UPLOADCARE_SECRET_KEY=<secret key>
   (used by db/init/05_uploadcare_secret.sh when a fresh stack is
   built from a backup)
4. restart the graphql server (picks up the function and the setting):
     docker compose up -d graphql
5. deploy the frontend (the new bundle no longer contains the secret)
6. test:
   - login and upload a file in the app
   - the anonymous query must be denied:
     curl -s https://api.apflora.ch/graphql \
       -H 'content-type: application/json' \
       -d '{"query":"{ uploadSignature { expire signature } }"}'
     -> permission denied for function upload_signature
   - the read-only roles are denied as well (they cannot INSERT into
     the *_file tables, so they must not mint signatures):
       docker exec apf_db psql -U postgres -d apflora -Atc \
         "SELECT r, has_function_privilege(r, 'apflora.upload_signature()', 'EXECUTE')
          FROM unnest(ARRAY['anon','apflora_reader','apflora_ap_reader','apflora_freiwillig','apflora_ap_writer','apflora_manager']) r;"
     expected: false, false, false, true, true, true
7. only after uploads work in production (ideally wait a few days so
   PWA/service-worker caches have refreshed - browser-update nags
   stale browsers):
   - rotate the Uploadcare secret key in the dashboard
     (the old one is burned: it is in every previously deployed
     bundle and in users' service-worker caches)
   - update the setting from step 2 with the new key
   - remove VITE_UPLOADCARE_SECRET_KEY from the Vercel project env
     (local .env is already cleaned in this branch)

rollback:
- redeploy the previous frontend build and restore
  VITE_UPLOADCARE_SECRET_KEY in the Vercel project env.
  the database changes are harmless to keep.
