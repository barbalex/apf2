ALTER TABLE apflora.beobzuordnung RENAME id TO id_old;
ALTER TABLE apflora.beobzuordnung ADD COLUMN id UUID UNIQUE DEFAULT uuid_generate_v1mc();
ALTER TABLE apflora.beobzuordnung RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.beobzuordnung RENAME "BeobId" TO beob_id;
ALTER TABLE apflora.beobzuordnung RENAME "BeobNichtZuordnen" TO nicht_zuordnen;
ALTER TABLE apflora.beobzuordnung RENAME "BeobBemerkungen" TO bemerkungen;
ALTER TABLE apflora.beobzuordnung RENAME "BeobMutWann" TO changed;
ALTER TABLE apflora.beobzuordnung RENAME "BeobMutWer" TO changed_by;

COMMENT ON COLUMN apflora.beobzuordnung.id_old IS 'frühere id';
ALTER TABLE apflora.beobzuordnung RENAME TO tpopbeob;