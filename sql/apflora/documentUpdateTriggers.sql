-- adresse
DROP TRIGGER IF EXISTS adresse_updated ON apflora.adresse CASCADE;

DROP FUNCTION IF EXISTS adresse_updated () CASCADE;

CREATE FUNCTION adresse_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER adresse_updated
  BEFORE UPDATE ON apflora.adresse
  FOR EACH ROW
  EXECUTE PROCEDURE adresse_updated ();

-- ap
DROP TRIGGER IF EXISTS ap_updated ON apflora.ap CASCADE;

DROP FUNCTION IF EXISTS ap_updated () CASCADE;

CREATE FUNCTION ap_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_updated
  BEFORE UPDATE ON apflora.ap
  FOR EACH ROW
  EXECUTE PROCEDURE ap_updated ();

-- ap_user
DROP TRIGGER IF EXISTS ap_user_updated ON apflora.ap_user CASCADE;

DROP FUNCTION IF EXISTS ap_user_updated () CASCADE;

CREATE FUNCTION ap_user_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_user_updated
  BEFORE UPDATE ON apflora.ap_user
  FOR EACH ROW
  EXECUTE PROCEDURE ap_user_updated ();

-- ap_file
DROP TRIGGER IF EXISTS ap_file_updated ON apflora.ap_file CASCADE;

DROP FUNCTION IF EXISTS ap_file_updated () CASCADE;

CREATE FUNCTION ap_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_file_updated
  BEFORE UPDATE ON apflora.ap_file
  FOR EACH ROW
  EXECUTE PROCEDURE ap_file_updated ();

-- ap_history
DROP TRIGGER IF EXISTS ap_history_updated ON apflora.ap_history CASCADE;

DROP FUNCTION IF EXISTS ap_history_updated () CASCADE;

CREATE FUNCTION ap_history_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_history_updated
  BEFORE UPDATE ON apflora.ap_history
  FOR EACH ROW
  EXECUTE PROCEDURE ap_history_updated ();

-- userprojekt
-- DROP TRIGGER IF EXISTS userprojekt_updated ON apflora.userprojekt CASCADE;
-- DROP FUNCTION IF EXISTS userprojekt_updated () CASCADE;
-- CREATE FUNCTION userprojekt_updated ()
--   RETURNS TRIGGER
--   AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$
-- LANGUAGE plpgsql;
-- CREATE TRIGGER userprojekt_updated
--   BEFORE UPDATE ON apflora.userprojekt
--   FOR EACH ROW
--   EXECUTE PROCEDURE userprojekt_updated ();
--
-- ap_bearbstand_werte
DROP TRIGGER IF EXISTS ap_bearbstand_werte_updated ON apflora.ap_bearbstand_werte CASCADE;

DROP FUNCTION IF EXISTS ap_bearbstand_werte_updated () CASCADE;

CREATE FUNCTION ap_bearbstand_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_bearbstand_werte_updated
  BEFORE UPDATE ON apflora.ap_bearbstand_werte
  FOR EACH ROW
  EXECUTE PROCEDURE ap_bearbstand_werte_updated ();

-- user
DROP TRIGGER IF EXISTS user_updated ON apflora.user CASCADE;

DROP FUNCTION IF EXISTS user_updated () CASCADE;

CREATE FUNCTION user_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER user_updated
  BEFORE UPDATE ON apflora.user
  FOR EACH ROW
  EXECUTE PROCEDURE user_updated ();

-- userprojekt
-- DROP TRIGGER IF EXISTS userprojekt_updated ON apflora.userprojekt CASCADE;
-- DROP FUNCTION IF EXISTS userprojekt_updated () CASCADE;
-- CREATE FUNCTION userprojekt_updated ()
--   RETURNS TRIGGER
--   AS $$
-- BEGIN
--   NEW.updated_at = now();
--   RETURN NEW;
-- END;
-- $$
-- LANGUAGE plpgsql;
-- CREATE TRIGGER userprojekt_updated
--   BEFORE UPDATE ON apflora.userprojekt
--   FOR EACH ROW
--   EXECUTE PROCEDURE userprojekt_updated ();
--
-- ap_erfbeurtkrit_werte
DROP TRIGGER IF EXISTS ap_erfbeurtkrit_werte_updated ON apflora.ap_erfbeurtkrit_werte CASCADE;

DROP FUNCTION IF EXISTS ap_erfbeurtkrit_werte_updated () CASCADE;

CREATE FUNCTION ap_erfbeurtkrit_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_erfbeurtkrit_werte_updated
  BEFORE UPDATE ON apflora.ap_erfbeurtkrit_werte
  FOR EACH ROW
  EXECUTE PROCEDURE ap_erfbeurtkrit_werte_updated ();

-- ap_erfkrit_werte
DROP TRIGGER IF EXISTS ap_erfkrit_werte_updated ON apflora.ap_erfkrit_werte CASCADE;

DROP FUNCTION IF EXISTS ap_erfkrit_werte_updated () CASCADE;

CREATE FUNCTION ap_erfkrit_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_erfkrit_werte_updated
  BEFORE UPDATE ON apflora.ap_erfkrit_werte
  FOR EACH ROW
  EXECUTE PROCEDURE ap_erfkrit_werte_updated ();

-- ap_umsetzung_werte
DROP TRIGGER IF EXISTS ap_umsetzung_werte_updated ON apflora.ap_umsetzung_werte CASCADE;

DROP FUNCTION IF EXISTS ap_umsetzung_werte_updated () CASCADE;

CREATE FUNCTION ap_umsetzung_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ap_umsetzung_werte_updated
  BEFORE UPDATE ON apflora.ap_umsetzung_werte
  FOR EACH ROW
  EXECUTE PROCEDURE ap_umsetzung_werte_updated ();

-- apber
DROP TRIGGER IF EXISTS apber_updated ON apflora.apber CASCADE;

DROP FUNCTION IF EXISTS apber_updated () CASCADE;

CREATE FUNCTION apber_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER apber_updated
  BEFORE UPDATE ON apflora.apber
  FOR EACH ROW
  EXECUTE PROCEDURE apber_updated ();

-- apberuebersicht
DROP TRIGGER IF EXISTS apberuebersicht_updated ON apflora.apberuebersicht CASCADE;

DROP FUNCTION IF EXISTS apberuebersicht_updated () CASCADE;

CREATE FUNCTION apberuebersicht_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER apberuebersicht_updated
  BEFORE UPDATE ON apflora.apberuebersicht
  FOR EACH ROW
  EXECUTE PROCEDURE apberuebersicht_updated ();

-- assozart
DROP TRIGGER IF EXISTS assozart_updated ON apflora.assozart CASCADE;

DROP FUNCTION IF EXISTS assozart_updated () CASCADE;

CREATE FUNCTION assozart_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER assozart_updated
  BEFORE UPDATE ON apflora.assozart
  FOR EACH ROW
  EXECUTE PROCEDURE assozart_updated ();

-- projekt
DROP TRIGGER IF EXISTS projekt_updated ON apflora.projekt CASCADE;

DROP FUNCTION IF EXISTS projekt_updated () CASCADE;

CREATE FUNCTION projekt_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER projekt_updated
  BEFORE UPDATE ON apflora.projekt
  FOR EACH ROW
  EXECUTE PROCEDURE projekt_updated ();

-- erfkrit
DROP TRIGGER IF EXISTS erfkrit_updated ON apflora.erfkrit CASCADE;

DROP FUNCTION IF EXISTS erfkrit_updated () CASCADE;

CREATE FUNCTION erfkrit_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER erfkrit_updated
  BEFORE UPDATE ON apflora.erfkrit
  FOR EACH ROW
  EXECUTE PROCEDURE erfkrit_updated ();

-- idealbiotop
DROP TRIGGER IF EXISTS idealbiotop_updated ON apflora.idealbiotop CASCADE;

DROP FUNCTION IF EXISTS idealbiotop_updated () CASCADE;

CREATE FUNCTION idealbiotop_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER idealbiotop_updated
  BEFORE UPDATE ON apflora.idealbiotop
  FOR EACH ROW
  EXECUTE PROCEDURE idealbiotop_updated ();

-- idealbiotop_file
DROP TRIGGER IF EXISTS idealbiotop_file_updated ON apflora.idealbiotop_file CASCADE;

DROP FUNCTION IF EXISTS idealbiotop_file_updated () CASCADE;

CREATE FUNCTION idealbiotop_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER idealbiotop_file_updated
  BEFORE UPDATE ON apflora.idealbiotop_file
  FOR EACH ROW
  EXECUTE PROCEDURE idealbiotop_file_updated ();

-- pop
DROP TRIGGER IF EXISTS pop_updated ON apflora.pop CASCADE;

DROP FUNCTION IF EXISTS pop_updated () CASCADE;

CREATE FUNCTION pop_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER pop_updated
  BEFORE UPDATE ON apflora.pop
  FOR EACH ROW
  EXECUTE PROCEDURE pop_updated ();

-- pop_file
DROP TRIGGER IF EXISTS pop_file_updated ON apflora.pop_file CASCADE;

DROP FUNCTION IF EXISTS pop_file_updated () CASCADE;

CREATE FUNCTION pop_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER pop_file_updated
  BEFORE UPDATE ON apflora.pop_file
  FOR EACH ROW
  EXECUTE PROCEDURE pop_file_updated ();

-- pop_history
DROP TRIGGER IF EXISTS pop_history_updated ON apflora.pop_history CASCADE;

DROP FUNCTION IF EXISTS pop_history_updated () CASCADE;

CREATE FUNCTION pop_history_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER pop_history_updated
  BEFORE UPDATE ON apflora.pop_history
  FOR EACH ROW
  EXECUTE PROCEDURE pop_history_updated ();

-- pop_status_werte
DROP TRIGGER IF EXISTS pop_status_werte_updated ON apflora.pop_status_werte CASCADE;

DROP FUNCTION IF EXISTS pop_status_werte_updated () CASCADE;

CREATE FUNCTION pop_status_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER pop_status_werte_updated
  BEFORE UPDATE ON apflora.pop_status_werte
  FOR EACH ROW
  EXECUTE PROCEDURE pop_status_werte_updated ();

-- popber
DROP TRIGGER IF EXISTS popber_updated ON apflora.popber CASCADE;

DROP FUNCTION IF EXISTS popber_updated () CASCADE;

CREATE FUNCTION popber_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER popber_updated
  BEFORE UPDATE ON apflora.popber
  FOR EACH ROW
  EXECUTE PROCEDURE popber_updated ();

-- popmassnber
DROP TRIGGER IF EXISTS popmassnber_updated ON apflora.popmassnber CASCADE;

DROP FUNCTION IF EXISTS popmassnber_updated () CASCADE;

CREATE FUNCTION popmassnber_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER popmassnber_updated
  BEFORE UPDATE ON apflora.popmassnber
  FOR EACH ROW
  EXECUTE PROCEDURE popmassnber_updated ();

-- tpop
DROP TRIGGER IF EXISTS tpop_updated ON apflora.tpop CASCADE;

DROP FUNCTION IF EXISTS tpop_updated () CASCADE;

CREATE FUNCTION tpop_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_updated
  BEFORE UPDATE ON apflora.tpop
  FOR EACH ROW
  EXECUTE PROCEDURE tpop_updated ();

-- tpop_file
DROP TRIGGER IF EXISTS tpop_file_updated ON apflora.tpop_file CASCADE;

DROP FUNCTION IF EXISTS tpop_file_updated () CASCADE;

CREATE FUNCTION tpop_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_file_updated
  BEFORE UPDATE ON apflora.tpop_file
  FOR EACH ROW
  EXECUTE PROCEDURE tpop_file_updated ();

-- tpop_history
DROP TRIGGER IF EXISTS tpop_history_updated ON apflora.tpop_history CASCADE;

DROP FUNCTION IF EXISTS tpop_history_updated () CASCADE;

CREATE FUNCTION tpop_history_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_history_updated
  BEFORE UPDATE ON apflora.tpop_history
  FOR EACH ROW
  EXECUTE PROCEDURE tpop_history_updated ();

-- tpop_apberrelevant_grund_werte
DROP TRIGGER IF EXISTS tpop_apberrelevant_grund_werte_updated ON apflora.tpop_apberrelevant_grund_werte CASCADE;

DROP FUNCTION IF EXISTS tpop_apberrelevant_grund_werte_updated () CASCADE;

CREATE FUNCTION tpop_apberrelevant_grund_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_apberrelevant_grund_werte_updated
  BEFORE UPDATE ON apflora.tpop_apberrelevant_grund_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpop_apberrelevant_grund_werte_updated ();

-- tpop_entwicklung_werte
DROP TRIGGER IF EXISTS tpop_entwicklung_werte_updated ON apflora.tpop_entwicklung_werte CASCADE;

DROP FUNCTION IF EXISTS tpop_entwicklung_werte_updated () CASCADE;

CREATE FUNCTION tpop_entwicklung_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpop_entwicklung_werte_updated
  BEFORE UPDATE ON apflora.tpop_entwicklung_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpop_entwicklung_werte_updated ();

-- tpopber
DROP TRIGGER IF EXISTS tpopber_updated ON apflora.tpopber CASCADE;

DROP FUNCTION IF EXISTS tpopber_updated () CASCADE;

CREATE FUNCTION tpopber_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopber_updated
  BEFORE UPDATE ON apflora.tpopber
  FOR EACH ROW
  EXECUTE PROCEDURE tpopber_updated ();

-- tpopkontr
DROP TRIGGER IF EXISTS tpopkontr_updated ON apflora.tpopkontr CASCADE;

DROP FUNCTION IF EXISTS tpopkontr_updated () CASCADE;

CREATE FUNCTION tpopkontr_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_updated
  BEFORE UPDATE ON apflora.tpopkontr
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontr_updated ();

-- tpopkontr_file
DROP TRIGGER IF EXISTS tpopkontr_file_updated ON apflora.tpopkontr_file CASCADE;

DROP FUNCTION IF EXISTS tpopkontr_file_updated () CASCADE;

CREATE FUNCTION tpopkontr_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_file_updated
  BEFORE UPDATE ON apflora.tpopkontr_file
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontr_file_updated ();

-- tpopkontr_idbiotuebereinst_werte
DROP TRIGGER IF EXISTS tpopkontr_idbiotuebereinst_werte_updated ON apflora.tpopkontr_idbiotuebereinst_werte CASCADE;

DROP FUNCTION IF EXISTS tpopkontr_idbiotuebereinst_werte_updated () CASCADE;

CREATE FUNCTION tpopkontr_idbiotuebereinst_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_idbiotuebereinst_werte_updated
  BEFORE UPDATE ON apflora.tpopkontr_idbiotuebereinst_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontr_idbiotuebereinst_werte_updated ();

-- tpopkontr_typ_werte
DROP TRIGGER IF EXISTS tpopkontr_typ_werte_updated ON apflora.tpopkontr_typ_werte CASCADE;

DROP FUNCTION IF EXISTS tpopkontr_typ_werte_updated () CASCADE;

CREATE FUNCTION tpopkontr_typ_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontr_typ_werte_updated
  BEFORE UPDATE ON apflora.tpopkontr_typ_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontr_typ_werte_updated ();

-- tpopkontrzaehl
DROP TRIGGER IF EXISTS tpopkontrzaehl_updated ON apflora.tpopkontrzaehl CASCADE;

DROP FUNCTION IF EXISTS tpopkontrzaehl_updated () CASCADE;

CREATE FUNCTION tpopkontrzaehl_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_updated
  BEFORE UPDATE ON apflora.tpopkontrzaehl
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontrzaehl_updated ();

-- tpopkontrzaehl_einheit_werte
DROP TRIGGER IF EXISTS tpopkontrzaehl_einheit_werte_updated ON apflora.tpopkontrzaehl_einheit_werte CASCADE;

DROP FUNCTION IF EXISTS tpopkontrzaehl_einheit_werte_updated () CASCADE;

CREATE FUNCTION tpopkontrzaehl_einheit_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_einheit_werte_updated
  BEFORE UPDATE ON apflora.tpopkontrzaehl_einheit_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontrzaehl_einheit_werte_updated ();

-- tpopkontrzaehl_methode_werte
DROP TRIGGER IF EXISTS tpopkontrzaehl_methode_werte_updated ON apflora.tpopkontrzaehl_methode_werte CASCADE;

DROP FUNCTION IF EXISTS tpopkontrzaehl_methode_werte_updated () CASCADE;

CREATE FUNCTION tpopkontrzaehl_methode_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopkontrzaehl_methode_werte_updated
  BEFORE UPDATE ON apflora.tpopkontrzaehl_methode_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpopkontrzaehl_methode_werte_updated ();

-- tpopmassn
DROP TRIGGER IF EXISTS tpopmassn_updated ON apflora.tpopmassn CASCADE;

DROP FUNCTION IF EXISTS tpopmassn_updated () CASCADE;

CREATE FUNCTION tpopmassn_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_updated
  BEFORE UPDATE ON apflora.tpopmassn
  FOR EACH ROW
  EXECUTE PROCEDURE tpopmassn_updated ();

-- tpopmassn_file
DROP TRIGGER IF EXISTS tpopmassn_file_updated ON apflora.tpopmassn_file CASCADE;

DROP FUNCTION IF EXISTS tpopmassn_file_updated () CASCADE;

CREATE FUNCTION tpopmassn_file_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_file_updated
  BEFORE UPDATE ON apflora.tpopmassn_file
  FOR EACH ROW
  EXECUTE PROCEDURE tpopmassn_file_updated ();

-- tpopmassn_erfbeurt_werte
DROP TRIGGER IF EXISTS tpopmassn_erfbeurt_werte_updated ON apflora.tpopmassn_erfbeurt_werte CASCADE;

DROP FUNCTION IF EXISTS tpopmassn_erfbeurt_werte_updated () CASCADE;

CREATE FUNCTION tpopmassn_erfbeurt_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_erfbeurt_werte_updated
  BEFORE UPDATE ON apflora.tpopmassn_erfbeurt_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpopmassn_erfbeurt_werte_updated ();

-- tpopmassn_typ_werte
DROP TRIGGER IF EXISTS tpopmassn_typ_werte_updated ON apflora.tpopmassn_typ_werte CASCADE;

DROP FUNCTION IF EXISTS tpopmassn_typ_werte_updated () CASCADE;

CREATE FUNCTION tpopmassn_typ_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopmassn_typ_werte_updated
  BEFORE UPDATE ON apflora.tpopmassn_typ_werte
  FOR EACH ROW
  EXECUTE PROCEDURE tpopmassn_typ_werte_updated ();

-- tpopmassnber
DROP TRIGGER IF EXISTS tpopmassnber_updated ON apflora.tpopmassnber CASCADE;

DROP FUNCTION IF EXISTS tpopmassnber_updated () CASCADE;

CREATE FUNCTION tpopmassnber_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER tpopmassnber_updated
  BEFORE UPDATE ON apflora.tpopmassnber
  FOR EACH ROW
  EXECUTE PROCEDURE tpopmassnber_updated ();

-- ziel
DROP TRIGGER IF EXISTS ziel_updated ON apflora.ziel CASCADE;

DROP FUNCTION IF EXISTS ziel_updated () CASCADE;

CREATE FUNCTION ziel_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ziel_updated
  BEFORE UPDATE ON apflora.ziel
  FOR EACH ROW
  EXECUTE PROCEDURE ziel_updated ();

-- ziel_typ_werte
DROP TRIGGER IF EXISTS ziel_typ_werte_updated ON apflora.ziel_typ_werte CASCADE;

DROP FUNCTION IF EXISTS ziel_typ_werte_updated () CASCADE;

CREATE FUNCTION ziel_typ_werte_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER ziel_typ_werte_updated
  BEFORE UPDATE ON apflora.ziel_typ_werte
  FOR EACH ROW
  EXECUTE PROCEDURE ziel_typ_werte_updated ();

-- zielber
DROP TRIGGER IF EXISTS zielber_updated ON apflora.zielber CASCADE;

DROP FUNCTION IF EXISTS zielber_updated () CASCADE;

CREATE FUNCTION zielber_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER zielber_updated
  BEFORE UPDATE ON apflora.zielber
  FOR EACH ROW
  EXECUTE PROCEDURE zielber_updated ();

-- beob
DROP TRIGGER IF EXISTS beob_updated ON apflora.beob CASCADE;

DROP FUNCTION IF EXISTS beob_updated () CASCADE;

CREATE FUNCTION beob_updated ()
  RETURNS TRIGGER
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER beob_updated
  BEFORE UPDATE ON apflora.beob
  FOR EACH ROW
  EXECUTE PROCEDURE beob_updated ();

