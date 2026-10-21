-- New rows get uuidv7 instead of uuid v1: ids are time-ordered
-- (useful for ordering and later imports) and insert sequentially
-- into the primary key indexes (better locality than random ids).
-- Requires Postgres 18+ (native uuidv7()).
-- Existing rows keep their ids. Externally owned ids are unaffected:
-- ae_taxonomies (arteigenschaften.ch) and beob (source ids from
-- Info Flora/Evab imports) have no local default.
ALTER TABLE apflora.adresse ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap_bearbstand_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap_erfbeurtkrit_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap_erfkrit_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap_file ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap_umsetzung_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ap_user ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.apart ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.apber ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.apberuebersicht ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.assozart ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.beob ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.currentissue ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.detailplaene ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ek_abrechnungstyp_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ekfrequenz ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ekplan ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ekzaehleinheit ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.erfkrit ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.idealbiotop ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.idealbiotop_file ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.message ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.pop ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.pop_file ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.pop_status_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.popber ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.popmassnber ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.projekt ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpop ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpop_apberrelevant_grund_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpop_entwicklung_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpop_file ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopber ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontr ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontr_file ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontr_idbiotuebereinst_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontr_typ_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontrzaehl ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontrzaehl_einheit_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopkontrzaehl_methode_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopmassn ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopmassn_erfbeurt_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopmassn_file ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopmassn_typ_werte ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.tpopmassnber ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.user ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.usermessage ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ziel ALTER COLUMN id SET DEFAULT uuidv7();

ALTER TABLE apflora.ziel_typ_werte ALTER COLUMN id SET DEFAULT uuidv7();
