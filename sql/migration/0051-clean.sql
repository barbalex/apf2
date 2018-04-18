alter table apflora.adresse drop column id_old;
alter table apflora.ap 
   ADD CONSTRAINT ap_fk_ae_eigenschaften
   FOREIGN KEY (art_id) 
   REFERENCES ae_eigenschaften(id);
alter table apflora.ap drop column id_old;