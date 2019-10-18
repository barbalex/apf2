ALTER TABLE apflora.ap DROP CONSTRAINT ap_fk_ae_eigenschaften;
ALTER TABLE apflora.ap
    ADD CONSTRAINT ap_fk_ae_taxonomies FOREIGN KEY (art_id)
    REFERENCES apflora.ae_taxonomies (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
ALTER TABLE apflora.assozart DROP CONSTRAINT assozart_fk_ae_eigenschaften;
ALTER TABLE apflora.assozart
    ADD CONSTRAINT assozart_fk_ae_taxonomies FOREIGN KEY (ae_id)
    REFERENCES apflora.ae_taxonomies (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
ALTER TABLE apflora.beob DROP CONSTRAINT beob_fk_ae_eigenschaften;
ALTER TABLE apflora.beob
    ADD CONSTRAINT beob_fk_ae_taxonomies FOREIGN KEY (art_id)
    REFERENCES apflora.ae_taxonomies (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
ALTER TABLE apflora.beob DROP CONSTRAINT beob_art_id_original_fkey;
ALTER TABLE apflora.beob
    ADD CONSTRAINT beob_fk_ae_taxonomies_original FOREIGN KEY (art_id_original)
    REFERENCES apflora.ae_taxonomies (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
ALTER TABLE apflora.apart DROP CONSTRAINT apart_fk_ae_eigenschaften;
ALTER TABLE apflora.apart
    ADD CONSTRAINT apart_fk_ae_taxonomies FOREIGN KEY (art_id)
    REFERENCES apflora.ae_taxonomies (id) MATCH SIMPLE
    ON UPDATE CASCADE
    ON DELETE NO ACTION;
DROP TABLE IF EXISTS apflora.ae_eigenschaften cascade;
-- run createViews