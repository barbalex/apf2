
ALTER TABLE apflora.beob RENAME id TO id_old;
ALTER TABLE apflora.beob ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beob RENAME "ArtId" TO art_id_old;
ALTER TABLE apflora.beob ADD COLUMN art_id UUID UNIQUE DEFAULT NULL;
ALTER TABLE apflora.beob RENAME "QuelleId" TO quelle_id;
ALTER TABLE apflora.beob RENAME "IdField" TO id_field;
ALTER TABLE apflora.beob RENAME "Datum" TO datum;
ALTER TABLE apflora.beob RENAME "Autor" TO autor;
ALTER TABLE apflora.beob RENAME "X" TO x;
ALTER TABLE apflora.beob RENAME "Y" TO y;

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
COMMENT ON COLUMN apflora.beob.id IS 'Primärschlüssel';
COMMENT ON COLUMN apflora.beob.id_old IS 'Frühere id';
COMMENT ON COLUMN apflora.beob.art_id_old IS 'Frühere Art id (=SISF2-Nr)';
TODO

-- drop existing indexes
DROP index IF EXISTS apflora.apflora."beob_ArtId_idx";
DROP index IF EXISTS apflora.apflora."beob_Datum_idx";
DROP index IF EXISTS apflora.apflora."beob_QuelleId_idx";
DROP index IF EXISTS apflora.apflora."beob_X_idx";
DROP index IF EXISTS apflora.apflora."beob_Y_idx";
DROP index IF EXISTS apflora.apflora."beob_expr_idx";
-- add new
TODO

-- change n-sides