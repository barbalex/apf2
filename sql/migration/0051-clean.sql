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
DROP TRIGGER IF EXISTS ap_erfbeurtkrit_werte_on_update_set_mut ON apflora.ap_erfbeurtkrit_werte;

DROP TRIGGER IF EXISTS ap_erfbeurtkrit_werte_on_update_set_mut ON apflora.ap_erfbeurtkrit_werte;
DROP FUNCTION IF EXISTS ap_erfbeurtkrit_werte_on_update_set_mut();
CREATE FUNCTION ap_erfbeurtkrit_werte_on_update_set_mut() RETURNS trigger AS $ap_erfbeurtkrit_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_erfbeurtkrit_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_erfbeurtkrit_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap_erfbeurtkrit_werte
  FOR EACH ROW EXECUTE PROCEDURE ap_erfbeurtkrit_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopmassn_erfbeurt_werte_on_update_set_mut ON apflora.tpopmassn_erfbeurt_werte;
DROP FUNCTION IF EXISTS tpopmassn_erfbeurt_werte_on_update_set_mut();
CREATE FUNCTION tpopmassn_erfbeurt_werte_on_update_set_mut() RETURNS trigger AS $tpopmassn_erfbeurt_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopmassn_erfbeurt_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_erfbeurt_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassn_erfbeurt_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopmassn_erfbeurt_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopmassn_typ_werte_on_update_set_mut ON apflora.tpopmassn_typ_werte;
DROP FUNCTION IF EXISTS tpopmassn_typ_werte_on_update_set_mut();
CREATE FUNCTION tpopmassn_typ_werte_on_update_set_mut() RETURNS trigger AS $tpopmassn_typ_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopmassn_typ_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_typ_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassn_typ_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopmassn_typ_werte_on_update_set_mut();

alter table apflora.tpopmassn 
   ADD CONSTRAINT tpopmassn_fk_adresse
   FOREIGN KEY (bearbeiter) 
   REFERENCES apflora.adresse(id) on delete set null on update cascade;

DROP TABLE IF EXISTS apflora.userprojekt;

DROP index IF EXISTS apflora.apflora."ziel_typ_werte_ZieltypId_idx";
DROP index IF EXISTS apflora.apflora."ziel_typ_werte_ZieltypOrd_idx";
DROP index IF EXISTS apflora.apflora."ziel_typ_werte_id_idx";
CREATE INDEX ON apflora.ziel_typ_werte USING btree (id);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (code);
CREATE INDEX ON apflora.ziel_typ_werte USING btree (sort);

DROP index IF EXISTS apflora.apflora."zielber_ziel_id_idx1";
CREATE INDEX ON apflora.zielber USING btree (ziel_id);