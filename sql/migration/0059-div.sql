ALTER TABLE apflora.tpop DROP CONSTRAINT tpop_id_key cascade;

ALTER TABLE apflora.tpopber ADD CONSTRAINT tpopber_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassn ADD CONSTRAINT tpopmassn_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopmassnber ADD CONSTRAINT tpopmassnber_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.beob ADD CONSTRAINT beob_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE apflora.tpopkontr ADD CONSTRAINT tpopkontr_tpop_id_fkey FOREIGN KEY (tpop_id) REFERENCES apflora.tpop (id) ON DELETE CASCADE ON UPDATE CASCADE;