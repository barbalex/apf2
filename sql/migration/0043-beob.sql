
ALTER TABLE apflora.beob RENAME id TO id_old;
ALTER TABLE apflora.beob ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beob RENAME "ArtId" TO art_id_old;
ALTER TABLE apflora.beob ADD COLUMN art_id UUID UNIQUE DEFAULT NULL;
ALTER TABLE apflora.beob RENAME "xxx" TO xxx;

-- add data for art_id
UPDATE apflora.beob SET art = (
  SELECT id FROM apflora.ae_eigenschaften WHERE taxid = apflora.beob.art_id_old
) WHERE art_id_old IS NOT NULL;

-- change primary key
ALTER TABLE apflora.beob DROP CONSTRAINT beob_pkey cascade;
ALTER TABLE apflora.beob ADD PRIMARY KEY (id);
ALTER TABLE apflora.beob ALTER COLUMN id_old DROP NOT NULL;
ALTER TABLE apflora.beob ALTER COLUMN id_old SET DEFAULT null;

-- comments
TODO

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."xxx";
-- add new
TODO

-- change n-sides