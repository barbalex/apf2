ALTER TABLE apflora.ap RENAME art TO art_id;
CREATE INDEX ON apflora.ap USING btree (art_id);

-- when ap is inserted
-- ensure apart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_beobart();
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
CREATE FUNCTION apflora.ap_insert_add_apart() RETURNS trigger AS $ap_insert_add_apart$
BEGIN
  INSERT INTO
    apflora.apart (ap_id, art_id)
  VALUES (NEW.id, NEW.art_id);
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();

-- when ap is inserted
-- ensure apart is created too
DROP TRIGGER IF EXISTS ap_insert_add_beobart ON apflora.ap;
DROP TRIGGER IF EXISTS ap_insert_add_apart ON apflora.ap;
DROP FUNCTION IF EXISTS apflora.ap_insert_add_beobart();
DROP FUNCTION IF EXISTS apflora.ap_insert_add_apart();
CREATE FUNCTION apflora.ap_insert_add_apart() RETURNS trigger AS $ap_insert_add_apart$
BEGIN
  INSERT INTO
    apflora.apart (ap_id, art_id)
  VALUES (NEW.id, NEW.art_id);
  RETURN NEW;
END;
$ap_insert_add_apart$ LANGUAGE plpgsql;

CREATE TRIGGER ap_insert_add_apart AFTER INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE apflora.ap_insert_add_apart();
