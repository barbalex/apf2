1. remove duplicates from beobzuordnung
  ```sql
  ALTER TABLE apflora.beobzuordnung ADD COLUMN "id" SERIAL;

  DELETE FROM apflora.beobzuordnung
  WHERE "id" NOT IN (
    SELECT min("id") from apflora.beobzuordnung
    GROUP BY "NO_NOTE"
  );
  ```

2. create table beob.beob, using create_tables_beob

3. add its data using 2017_beob_insert

4. alter table apflora.beobzuordnung to include BeobId
  ```sql
  ALTER TABLE apflora.beobzuordnung ADD COLUMN "BeobId" integer;
  ```

5. update data in apflora.beobzuordnung using 2017_update_beobzuordnung.sql

6. prepare table apflora.beobzuordnung to make BeobId primary key - check data:
  ```sql
  -- oops:
  SELECT count("BeobId") AS "anz_beob", "BeobId" from apflora.beobzuordnung
  GROUP BY "BeobId"
  HAVING count("BeobId") > 1
  ORDER BY "anz_beob" desc;

  -- oops:
  SELECT count("BeobId") AS "anz_beob", "BeobId" from apflora.beobzuordnung
  GROUP BY "BeobId"
  HAVING count("BeobId") = 0
  ORDER BY "anz_beob" desc;
  ```
  
7. alter table apflora.beobzuordnung to make BeobId primary key
  ```sql
  ALTER TABLE apflora.beobzuordnung ADD PRIMARY KEY ("BeobId");
  ```
