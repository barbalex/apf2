ALTER TABLE IF EXISTS apflora.adresse
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ap
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ap_history
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ap_bearbstand_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ap_erfbeurtkrit_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ap_erfkrit_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ap_umsetzung_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.apber
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.apberuebersicht
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.assozart
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.projekt
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.erfkrit
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.idealbiotop
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.pop
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.pop_history
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.pop_status_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.popber
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.popmassnber
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpop
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpop_history
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpop_apberrelevant_grund_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpop_entwicklung_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopber
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopkontr
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopkontr_idbiotuebereinst_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopkontr_typ_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopkontrzaehl
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopkontrzaehl_einheit_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopkontrzaehl_methode_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopmassn
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopmassn_erfbeurt_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopmassn_typ_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.tpopmassnber
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ziel
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ziel_typ_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.zielber
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.beob
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.apart
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ekzaehleinheit
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ekfrequenz
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ek_abrechnungstyp_werte
  DROP COLUMN IF EXISTS changed;

ALTER TABLE IF EXISTS apflora.ekplan
  DROP COLUMN IF EXISTS changed;

