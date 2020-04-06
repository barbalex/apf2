-- create list like this:
SELECT 'DROP VIEW if exists apflora.' || table_name || ' cascade;'
  FROM information_schema.views
 WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
   AND table_name !~ '^pg_';

-- then run it:
