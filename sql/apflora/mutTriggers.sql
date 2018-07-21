DROP TRIGGER IF EXISTS adresse_on_update_set_mut ON apflora.adresse;
DROP FUNCTION IF EXISTS adresse_on_update_set_mut();
CREATE FUNCTION adresse_on_update_set_mut() RETURNS trigger AS $adresse_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$adresse_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER adresse_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.adresse
  FOR EACH ROW EXECUTE PROCEDURE adresse_on_update_set_mut();

DROP TRIGGER IF EXISTS ap_on_update_set_mut ON apflora.ap;
DROP FUNCTION IF EXISTS ap_on_update_set_mut();
CREATE FUNCTION ap_on_update_set_mut() RETURNS trigger AS $ap_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap
  FOR EACH ROW EXECUTE PROCEDURE ap_on_update_set_mut();

DROP TRIGGER IF EXISTS ap_bearbstand_werte_on_update_set_mut ON apflora.ap_bearbstand_werte;
DROP FUNCTION IF EXISTS ap_bearbstand_werte_on_update_set_mut();
CREATE FUNCTION ap_bearbstand_werte_on_update_set_mut() RETURNS trigger AS $ap_bearbstand_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_bearbstand_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_bearbstand_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap_bearbstand_werte
  FOR EACH ROW EXECUTE PROCEDURE ap_bearbstand_werte_on_update_set_mut();

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

DROP TRIGGER IF EXISTS ap_erfkrit_werte_on_update_set_mut ON apflora.ap_erfkrit_werte;
DROP FUNCTION IF EXISTS ap_erfkrit_werte_on_update_set_mut();
CREATE FUNCTION ap_erfkrit_werte_on_update_set_mut() RETURNS trigger AS $ap_erfkrit_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_erfkrit_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_erfkrit_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap_erfkrit_werte
  FOR EACH ROW EXECUTE PROCEDURE ap_erfkrit_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS ap_umsetzung_werte_on_update_set_mut ON apflora.ap_umsetzung_werte;
DROP FUNCTION IF EXISTS ap_umsetzung_werte_on_update_set_mut();
CREATE FUNCTION ap_umsetzung_werte_on_update_set_mut() RETURNS trigger AS $ap_umsetzung_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ap_umsetzung_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ap_umsetzung_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ap_umsetzung_werte
  FOR EACH ROW EXECUTE PROCEDURE ap_umsetzung_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS apber_on_update_set_mut ON apflora.apber;
DROP FUNCTION IF EXISTS apber_on_update_set_mut();
CREATE FUNCTION apber_on_update_set_mut() RETURNS trigger AS $apber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$apber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER apber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.apber
  FOR EACH ROW EXECUTE PROCEDURE apber_on_update_set_mut();

DROP TRIGGER IF EXISTS apberuebersicht_on_update_set_mut ON apflora.apberuebersicht;
DROP FUNCTION IF EXISTS apberuebersicht_on_update_set_mut();
CREATE FUNCTION apberuebersicht_on_update_set_mut() RETURNS trigger AS $apberuebersicht_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$apberuebersicht_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER apberuebersicht_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.apberuebersicht
  FOR EACH ROW EXECUTE PROCEDURE apberuebersicht_on_update_set_mut();

DROP TRIGGER IF EXISTS assozart_on_update_set_mut ON apflora.assozart;
DROP FUNCTION IF EXISTS assozart_on_update_set_mut();
CREATE FUNCTION assozart_on_update_set_mut() RETURNS trigger AS $assozart_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$assozart_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER assozart_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.assozart
  FOR EACH ROW EXECUTE PROCEDURE assozart_on_update_set_mut();

DROP TRIGGER IF EXISTS beob_on_update_set_mut ON apflora.beob;
DROP FUNCTION IF EXISTS beob_on_update_set_mut();
CREATE FUNCTION beob_on_update_set_mut() RETURNS trigger AS $beob_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$beob_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER beob_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.beob
  FOR EACH ROW EXECUTE PROCEDURE beob_on_update_set_mut();

DROP TRIGGER IF EXISTS projekt_on_update_set_mut ON apflora.projekt;
DROP FUNCTION IF EXISTS projekt_on_update_set_mut();
CREATE FUNCTION projekt_on_update_set_mut() RETURNS trigger AS $projekt_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$projekt_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER projekt_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.projekt
  FOR EACH ROW EXECUTE PROCEDURE projekt_on_update_set_mut();

DROP TRIGGER IF EXISTS ber_on_update_set_mut ON apflora.ber;
DROP FUNCTION IF EXISTS ber_on_update_set_mut();
CREATE FUNCTION ber_on_update_set_mut() RETURNS trigger AS $ber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ber
  FOR EACH ROW EXECUTE PROCEDURE ber_on_update_set_mut();

DROP TRIGGER IF EXISTS erfkrit_on_update_set_mut ON apflora.erfkrit;
DROP FUNCTION IF EXISTS erfkrit_on_update_set_mut();
CREATE FUNCTION erfkrit_on_update_set_mut() RETURNS trigger AS $erfkrit_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$erfkrit_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER erfkrit_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.erfkrit
  FOR EACH ROW EXECUTE PROCEDURE erfkrit_on_update_set_mut();

DROP TRIGGER IF EXISTS idealbiotop_on_update_set_mut ON apflora.idealbiotop;
DROP FUNCTION IF EXISTS idealbiotop_on_update_set_mut();
CREATE FUNCTION idealbiotop_on_update_set_mut() RETURNS trigger AS $idealbiotop_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$idealbiotop_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER idealbiotop_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.idealbiotop
  FOR EACH ROW EXECUTE PROCEDURE idealbiotop_on_update_set_mut();

DROP TRIGGER IF EXISTS pop_on_update_set_mut ON apflora.pop;
DROP FUNCTION IF EXISTS pop_on_update_set_mut();
CREATE FUNCTION pop_on_update_set_mut() RETURNS trigger AS $pop_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$pop_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER pop_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.pop
  FOR EACH ROW EXECUTE PROCEDURE pop_on_update_set_mut();

DROP TRIGGER IF EXISTS pop_status_werte_on_update_set_mut ON apflora.pop_status_werte;
DROP FUNCTION IF EXISTS pop_status_werte_on_update_set_mut();
CREATE FUNCTION pop_status_werte_on_update_set_mut() RETURNS trigger AS $pop_status_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$pop_status_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER pop_status_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.pop_status_werte
  FOR EACH ROW EXECUTE PROCEDURE pop_status_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS popber_on_update_set_mut ON apflora.popber;
DROP FUNCTION IF EXISTS popber_on_update_set_mut();
CREATE FUNCTION popber_on_update_set_mut() RETURNS trigger AS $popber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$popber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER popber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.popber
  FOR EACH ROW EXECUTE PROCEDURE popber_on_update_set_mut();

DROP TRIGGER IF EXISTS popmassnber_on_update_set_mut ON apflora.popmassnber;
DROP FUNCTION IF EXISTS popmassnber_on_update_set_mut();
CREATE FUNCTION popmassnber_on_update_set_mut() RETURNS trigger AS $popmassnber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$popmassnber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER popmassnber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.popmassnber
  FOR EACH ROW EXECUTE PROCEDURE popmassnber_on_update_set_mut();

DROP TRIGGER IF EXISTS tpop_on_update_set_mut ON apflora.tpop;
DROP FUNCTION IF EXISTS tpop_on_update_set_mut();
CREATE FUNCTION tpop_on_update_set_mut() RETURNS trigger AS $tpop_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpop_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpop
  FOR EACH ROW EXECUTE PROCEDURE tpop_on_update_set_mut();

DROP TRIGGER IF EXISTS tpop_apberrelevant_werte_on_update_set_mut ON apflora.tpop_apberrelevant_werte;
DROP FUNCTION IF EXISTS tpop_apberrelevant_werte_on_update_set_mut();
CREATE FUNCTION tpop_apberrelevant_werte_on_update_set_mut() RETURNS trigger AS $tpop_apberrelevant_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpop_apberrelevant_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_apberrelevant_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpop_apberrelevant_werte
  FOR EACH ROW EXECUTE PROCEDURE tpop_apberrelevant_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpop_entwicklung_werte_on_update_set_mut ON apflora.tpop_entwicklung_werte;
DROP FUNCTION IF EXISTS tpop_entwicklung_werte_on_update_set_mut();
CREATE FUNCTION tpop_entwicklung_werte_on_update_set_mut() RETURNS trigger AS $tpop_entwicklung_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpop_entwicklung_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpop_entwicklung_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpop_entwicklung_werte
  FOR EACH ROW EXECUTE PROCEDURE tpop_entwicklung_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopber_on_update_set_mut ON apflora.tpopber;
DROP FUNCTION IF EXISTS tpopber_on_update_set_mut();
CREATE FUNCTION tpopber_on_update_set_mut() RETURNS trigger AS $tpopber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopber
  FOR EACH ROW EXECUTE PROCEDURE tpopber_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontr_on_update_set_mut ON apflora.tpopkontr;
DROP FUNCTION IF EXISTS tpopkontr_on_update_set_mut();
CREATE FUNCTION tpopkontr_on_update_set_mut() RETURNS trigger AS $tpopkontr_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    IF OLD.ekf_verifiziert <> NEW.ekf_verifiziert THEN
      NEW.ekf_verifiziert_durch = current_setting('request.jwt.claim.username', true);
      NEW.ekf_verifiziert_datum = NOW();
    END IF;
    RETURN NEW;
  END;
$tpopkontr_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontr
  FOR EACH ROW EXECUTE PROCEDURE tpopkontr_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontr_idbiotuebereinst_werte_on_update_set_mut ON apflora.tpopkontr_idbiotuebereinst_werte;
DROP FUNCTION IF EXISTS tpopkontr_idbiotuebereinst_werte_on_update_set_mut();
CREATE FUNCTION tpopkontr_idbiotuebereinst_werte_on_update_set_mut() RETURNS trigger AS $tpopkontr_idbiotuebereinst_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontr_idbiotuebereinst_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_idbiotuebereinst_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontr_idbiotuebereinst_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontr_idbiotuebereinst_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontr_typ_werte_on_update_set_mut ON apflora.tpopkontr_typ_werte;
DROP FUNCTION IF EXISTS tpopkontr_typ_werte_on_update_set_mut();
CREATE FUNCTION tpopkontr_typ_werte_on_update_set_mut() RETURNS trigger AS $tpopkontr_typ_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontr_typ_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_typ_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontr_typ_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontr_typ_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontrzaehl_on_update_set_mut ON apflora.tpopkontrzaehl;
DROP FUNCTION IF EXISTS tpopkontrzaehl_on_update_set_mut();
CREATE FUNCTION tpopkontrzaehl_on_update_set_mut() RETURNS trigger AS $tpopkontrzaehl_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontrzaehl_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontrzaehl
  FOR EACH ROW EXECUTE PROCEDURE tpopkontrzaehl_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontrzaehl_einheit_werte_on_update_set_mut ON apflora.tpopkontrzaehl_einheit_werte;
DROP FUNCTION IF EXISTS tpopkontrzaehl_einheit_werte_on_update_set_mut();
CREATE FUNCTION tpopkontrzaehl_einheit_werte_on_update_set_mut() RETURNS trigger AS $tpopkontrzaehl_einheit_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontrzaehl_einheit_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_einheit_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontrzaehl_einheit_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontrzaehl_einheit_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopkontrzaehl_methode_werte_on_update_set_mut ON apflora.tpopkontrzaehl_methode_werte;
DROP FUNCTION IF EXISTS tpopkontrzaehl_methode_werte_on_update_set_mut();
CREATE FUNCTION tpopkontrzaehl_methode_werte_on_update_set_mut() RETURNS trigger AS $tpopkontrzaehl_methode_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopkontrzaehl_methode_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_methode_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopkontrzaehl_methode_werte
  FOR EACH ROW EXECUTE PROCEDURE tpopkontrzaehl_methode_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS tpopmassn_on_update_set_mut ON apflora.tpopmassn;
DROP FUNCTION IF EXISTS tpopmassn_on_update_set_mut();
CREATE FUNCTION tpopmassn_on_update_set_mut() RETURNS trigger AS $tpopmassn_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopmassn_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassn
  FOR EACH ROW EXECUTE PROCEDURE tpopmassn_on_update_set_mut();

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

DROP TRIGGER IF EXISTS tpopmassnber_on_update_set_mut ON apflora.tpopmassnber;
DROP FUNCTION IF EXISTS tpopmassnber_on_update_set_mut();
CREATE FUNCTION tpopmassnber_on_update_set_mut() RETURNS trigger AS $tpopmassnber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$tpopmassnber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER tpopmassnber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.tpopmassnber
  FOR EACH ROW EXECUTE PROCEDURE tpopmassnber_on_update_set_mut();

DROP TRIGGER IF EXISTS ziel_on_update_set_mut ON apflora.ziel;
DROP FUNCTION IF EXISTS ziel_on_update_set_mut();
CREATE FUNCTION ziel_on_update_set_mut() RETURNS trigger AS $ziel_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ziel_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ziel_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ziel
  FOR EACH ROW EXECUTE PROCEDURE ziel_on_update_set_mut();

DROP TRIGGER IF EXISTS ziel_typ_werte_on_update_set_mut ON apflora.ziel_typ_werte;
DROP FUNCTION IF EXISTS ziel_typ_werte_on_update_set_mut();
CREATE FUNCTION ziel_typ_werte_on_update_set_mut() RETURNS trigger AS $ziel_typ_werte_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ziel_typ_werte_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ziel_typ_werte_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ziel_typ_werte
  FOR EACH ROW EXECUTE PROCEDURE ziel_typ_werte_on_update_set_mut();

DROP TRIGGER IF EXISTS zielber_on_update_set_mut ON apflora.zielber;
DROP FUNCTION IF EXISTS zielber_on_update_set_mut();
CREATE FUNCTION zielber_on_update_set_mut() RETURNS trigger AS $zielber_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$zielber_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER zielber_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.zielber
  FOR EACH ROW EXECUTE PROCEDURE zielber_on_update_set_mut();

DROP TRIGGER IF EXISTS ekfzaehleinheit_on_update_set_mut ON apflora.ekfzaehleinheit;
DROP FUNCTION IF EXISTS ekfzaehleinheit_on_update_set_mut();
CREATE FUNCTION ekfzaehleinheit_on_update_set_mut() RETURNS trigger AS $ekfzaehleinheit_on_update_set_mut$
  BEGIN
    NEW.changed_by = current_setting('request.jwt.claim.username', true);
    NEW.changed = NOW();
    RETURN NEW;
  END;
$ekfzaehleinheit_on_update_set_mut$ LANGUAGE plpgsql;

CREATE TRIGGER ekfzaehleinheit_on_update_set_mut BEFORE UPDATE OR INSERT ON apflora.ekfzaehleinheit
  FOR EACH ROW EXECUTE PROCEDURE ekfzaehleinheit_on_update_set_mut();
