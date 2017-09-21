-- needed function:
CREATE OR REPLACE FUNCTION tabelle_update_notify() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('tabelle_update', json_build_object('table', TG_TABLE_NAME, 'type', TG_OP, 'row', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tabelle_insert_notify() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('tabelle_update', json_build_object('table', TG_TABLE_NAME, 'type', TG_OP, 'row', row_to_json(NEW))::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION tabelle_delete_notify() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('tabelle_update', json_build_object('table', TG_TABLE_NAME, 'type', TG_OP, 'row', row_to_json(OLD))::text);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- examples:
DROP TRIGGER IF EXISTS tabelle_notify_update ON apflora.tpop;
CREATE TRIGGER tabelle_notify_update AFTER UPDATE ON apflora.tpop FOR EACH ROW EXECUTE PROCEDURE tabelle_update_notify();

DROP TRIGGER IF EXISTS tabelle_notify_insert ON apflora.tpop;
CREATE TRIGGER tabelle_notify_insert AFTER INSERT ON apflora.tpop FOR EACH ROW EXECUTE PROCEDURE tabelle_insert_notify();

DROP TRIGGER IF EXISTS tabelle_notify_delete ON apflora.tpop;
CREATE TRIGGER tabelle_notify_delete AFTER DELETE ON apflora.tpop FOR EACH ROW EXECUTE PROCEDURE tabelle_delete_notify();

-- create code to do it with all tables:
-- run these in psql, then copy and run output
SELECT
    'DROP TRIGGER IF EXISTS '
    || tabnames.table_name
    || '_notify_update ON apflora.'
    || tabnames.table_name
    || ';' AS trigger_drop_query
FROM (
    SELECT
        table_name
    FROM
        information_schema.tables
    WHERE
        table_schema  = 'apflora'
) AS tabnames;

SELECT
    'DROP TRIGGER IF EXISTS '
    || tabnames.table_name
    || '_notify_insert ON apflora.'
    || tabnames.table_name
    || ';' AS trigger_drop_query
FROM (
    SELECT
        table_name
    FROM
        information_schema.tables
    WHERE
        table_schema  = 'apflora'
) AS tabnames;

SELECT
    'DROP TRIGGER IF EXISTS '
    || tabnames.table_name
    || '_notify_delete ON apflora.'
    || tabnames.table_name
    || ';' AS trigger_drop_query
FROM (
    SELECT
        table_name
    FROM
        information_schema.tables
    WHERE
        table_schema  = 'apflora'
) AS tabnames;

SELECT
    'CREATE TRIGGER '
    || tabnames.table_name
    || '_notify_update AFTER UPDATE ON apflora.'
    || tabnames.table_name
    || ' FOR EACH ROW EXECUTE PROCEDURE tabelle_update_notify();' AS trigger_creation_query
FROM (
    SELECT
        table_name
    FROM
        information_schema.tables
    WHERE
        table_schema  = 'apflora'
) AS tabnames;

SELECT
    'CREATE TRIGGER '
    || tabnames.table_name
    || '_notify_insert AFTER INSERT ON apflora.'
    || tabnames.table_name
    || ' FOR EACH ROW EXECUTE PROCEDURE tabelle_insert_notify();' AS trigger_creation_query
FROM (
    SELECT
        table_name
    FROM
        information_schema.tables
    WHERE
        table_schema  = 'apflora'
) AS tabnames;

SELECT
    'CREATE TRIGGER '
    || tabnames.table_name
    || '_notify_delete AFTER DELETE ON apflora.'
    || tabnames.table_name
    || ' FOR EACH ROW EXECUTE PROCEDURE tabelle_delete_notify();' AS trigger_creation_query
FROM (
    SELECT
        table_name
    FROM
        information_schema.tables
    WHERE
        table_schema  = 'apflora'
) AS tabnames;
