alter table apflora.ap 
   ADD CONSTRAINT ap_fk_ae_eigenschaften
   FOREIGN KEY (art_id) 
   REFERENCES apflora.ae_eigenschaften(id) on delete set null on update cascade;
CREATE INDEX ON apflora.apart USING btree (art_id);
alter table apflora.apart 
   ADD CONSTRAINT apart_fk_ae_eigenschaften
   FOREIGN KEY (art_id) 
   REFERENCES apflora.ae_eigenschaften(id) on delete set null on update cascade;
alter table apflora.apber 
   ADD CONSTRAINT apber_fk_adresse
   FOREIGN KEY (bearbeiter) 
   REFERENCES apflora.adresse(id) on delete set null on update cascade;
alter table apflora.beob 
   ADD CONSTRAINT beob_fk_ae_eigenschaften
   FOREIGN KEY (art_id) 
   REFERENCES apflora.ae_eigenschaften(id) on delete set null on update cascade;
alter table apflora.beob 
   ADD CONSTRAINT beob_fk_beob_quelle_werte
   FOREIGN KEY (quelle_id) 
   REFERENCES apflora.beob_quelle_werte(id) on delete set null on update cascade;