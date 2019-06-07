-- 1. drop all fields
-- need to cascade because of views calling *
ALTER TABLE apflora.adresse DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.ap DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.apart DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.apber DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.apberuebersicht DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.assozart DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.beob DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.beob_quelle_werte DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.ber DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.erfkrit DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.message DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.pop DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.popber DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.popmassnber DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.projekt DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.tpop DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.tpopber DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.tpopkontr DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.tpopkontrzaehl DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.tpopmassn DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.tpopmassnber DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.ziel DROP COLUMN id_old CASCADE;
ALTER TABLE apflora.zielber DROP COLUMN id_old CASCADE;


ALTER TABLE apflora.beob DROP COLUMN art_id_old CASCADE;

-- 2. rebuild all views