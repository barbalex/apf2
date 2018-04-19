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
DROP index IF EXISTS apflora.apflora."tpop_TPopHerkunft_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopApBerichtRelevant_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopFlurname_idx";
DROP index IF EXISTS apflora.apflora."tpop_gemeinde_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopGemeinde_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopId_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopNr_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopXKoord_idx";
DROP index IF EXISTS apflora.apflora."tpop_TPopYKoord_idx";
alter table apflora.tpopkontr 
   ADD CONSTRAINT tpopkontr_fk_adresse
   FOREIGN KEY (bearbeiter) 
   REFERENCES apflora.adresse(id) on delete set null on update cascade;
DROP index IF EXISTS apflora.apflora."tpopkontr_idbiotuebereinst_werte_DomainCode_idx";
DROP index IF EXISTS apflora.apflora."tpopkontr_idbiotuebereinst_werte_DomainOrd_idx";
DROP index IF EXISTS apflora.apflora."tpopkontr_idbiotuebereinst_werte_id_idx";
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (id);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (code);
CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree (sort);