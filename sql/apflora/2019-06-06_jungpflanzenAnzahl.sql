-- 1. update app

-- 2. drop field
ALTER TABLE apflora.tpopkontr DROP COLUMN jungpflanzen_anzahl cascade;

-- 3. rerun all views

-- 4. restart postgraphile