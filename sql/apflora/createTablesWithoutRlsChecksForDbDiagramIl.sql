-- tpopkontrzaehl_einheit_werte
DROP TABLE IF EXISTS apflora.tpopkontrzaehl_einheit_werte;

CREATE TABLE apflora.tpopkontrzaehl_einheit_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  corresponds_to_massn_anz_triebe boolean DEFAULT FALSE,
  corresponds_to_massn_anz_pflanzen boolean DEFAULT FALSE,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  needs_no_methode_anzahl boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpopkontrzaehl_einheit_werte_code_seq owned BY apflora.tpopkontrzaehl_einheit_werte.code;

ALTER TABLE apflora.tpopkontrzaehl_einheit_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpopkontrzaehl_einheit_werte_code_seq');

SELECT
  setval('apflora.tpopkontrzaehl_einheit_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpopkontrzaehl_einheit_werte), FALSE);

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree(id);

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree(code);

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree(sort);

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree(historic);

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree(corresponds_to_massn_anz_triebe);

CREATE INDEX ON apflora.tpopkontrzaehl_einheit_werte USING btree(corresponds_to_massn_anz_pflanzen);

COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.corresponds_to_massn_anz_triebe IS 'Entspricht den "Anzahl Triebe" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen';

COMMENT ON COLUMN apflora.tpopkontrzaehl_einheit_werte.corresponds_to_massn_anz_pflanzen IS 'Entspricht den "Anzahl Pflanzen" bei Massnahmen. Ermöglicht es, tpopmassn.zieleinheit_anzahl automatisch zu setzen';

-- tpopkontrzaehl_methode_werte
DROP TABLE IF EXISTS apflora.tpopkontrzaehl_methode_werte;

CREATE TABLE apflora.tpopkontrzaehl_methode_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpopkontrzaehl_methode_werte_code_seq owned BY apflora.tpopkontrzaehl_methode_werte.code;

ALTER TABLE apflora.tpopkontrzaehl_methode_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpopkontrzaehl_methode_werte_code_seq');

SELECT
  setval('apflora.tpopkontrzaehl_methode_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpopkontrzaehl_methode_werte), FALSE);

ALTER TABLE apflora.tpopkontrzaehl_methode_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

ALTER TABLE apflora.tpopkontrzaehl_methode_werte
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree(id);

CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree(code);

CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree(sort);

CREATE INDEX ON apflora.tpopkontrzaehl_methode_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpopkontrzaehl_methode_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ziel_typ_werte
DROP TABLE IF EXISTS apflora.ziel_typ_werte;

CREATE TABLE apflora.ziel_typ_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) NOT NULL
);

CREATE SEQUENCE apflora.ziel_typ_werte_code_seq owned BY apflora.ziel_typ_werte.code;

ALTER TABLE apflora.ziel_typ_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.ziel_typ_werte_code_seq');

SELECT
  setval('apflora.ziel_typ_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.ziel_typ_werte), FALSE);

ALTER TABLE apflora.ziel_typ_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.ziel_typ_werte USING btree(id);

CREATE INDEX ON apflora.ziel_typ_werte USING btree(code);

CREATE INDEX ON apflora.ziel_typ_werte USING btree(sort);

CREATE INDEX ON apflora.ziel_typ_werte USING btree(historic);

COMMENT ON COLUMN apflora.ziel_typ_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ziel_typ_werte.text IS 'Beschreibung des Ziels';

COMMENT ON COLUMN apflora.ziel_typ_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.ziel_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpopkontr_idbiotuebereinst_werte
DROP TABLE IF EXISTS apflora.tpopkontr_idbiotuebereinst_werte;

CREATE TABLE apflora.tpopkontr_idbiotuebereinst_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpopkontr_idbiotuebereinst_werte_code_seq owned BY apflora.tpopkontr_idbiotuebereinst_werte.code;

ALTER TABLE apflora.tpopkontr_idbiotuebereinst_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpopkontr_idbiotuebereinst_werte_code_seq');

SELECT
  setval('apflora.tpopkontr_idbiotuebereinst_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpopkontr_idbiotuebereinst_werte), FALSE);

ALTER TABLE apflora.tpopkontr_idbiotuebereinst_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree(id);

CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree(code);

CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree(sort);

CREATE INDEX ON apflora.tpopkontr_idbiotuebereinst_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpopkontr_idbiotuebereinst_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpopkontr_typ_werte
DROP TABLE IF EXISTS apflora.tpopkontr_typ_werte;

CREATE TABLE apflora.tpopkontr_typ_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) UNIQUE DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpopkontr_typ_werte_code_seq owned BY apflora.tpopkontr_typ_werte.code;

ALTER TABLE apflora.tpopkontr_typ_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpopkontr_typ_werte_code_seq');

SELECT
  setval('apflora.tpopkontr_typ_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpopkontr_typ_werte), FALSE);

ALTER TABLE apflora.tpopkontr_typ_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree(id);

CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree(code);

CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree(sort);

CREATE INDEX ON apflora.tpopkontr_typ_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpopkontr_typ_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpopkontr_typ_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpopkontr_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ek_abrechnungstyp_werte
DROP TABLE IF EXISTS apflora.ek_abrechnungstyp_werte;

CREATE TABLE apflora.ek_abrechnungstyp_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree(id);

CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree(code);

CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree(sort);

CREATE INDEX ON apflora.ek_abrechnungstyp_werte USING btree(historic);

COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.ek_abrechnungstyp_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpop_apberrelevant_grund_werte
DROP TABLE IF EXISTS apflora.tpop_apberrelevant_grund_werte;

CREATE TABLE apflora.tpop_apberrelevant_grund_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text text,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpop_apberrelevant_grund_werte_code_seq owned BY apflora.tpop_apberrelevant_grund_werte.code;

ALTER TABLE apflora.tpop_apberrelevant_grund_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpop_apberrelevant_grund_werte_code_seq');

SELECT
  setval('apflora.tpop_apberrelevant_grund_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpop_apberrelevant_grund_werte), FALSE);

ALTER TABLE apflora.tpop_apberrelevant_grund_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree(id);

CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree(code);

CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree(text);

CREATE INDEX ON apflora.tpop_apberrelevant_grund_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpop_apberrelevant_grund_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpopmassn_erfbeurt_werte
DROP TABLE IF EXISTS apflora.tpopmassn_erfbeurt_werte;

CREATE TABLE apflora.tpopmassn_erfbeurt_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpopmassn_erfbeurt_werte_code_seq owned BY apflora.tpopmassn_erfbeurt_werte.code;

ALTER TABLE apflora.tpopmassn_erfbeurt_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpopmassn_erfbeurt_werte_code_seq');

SELECT
  setval('apflora.tpopmassn_erfbeurt_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpopmassn_erfbeurt_werte), FALSE);

ALTER TABLE apflora.tpopmassn_erfbeurt_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree(id);

CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree(code);

CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree(sort);

CREATE INDEX ON apflora.tpopmassn_erfbeurt_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.text IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';

COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpopmassn_erfbeurt_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpopmassn_typ_werte
DROP TABLE IF EXISTS apflora.tpopmassn_typ_werte;

CREATE TABLE apflora.tpopmassn_typ_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  ansiedlung boolean DEFAULT FALSE,
  anpflanzung boolean DEFAULT FALSE,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpopmassn_typ_werte_code_seq owned BY apflora.tpopmassn_typ_werte.code;

ALTER TABLE apflora.tpopmassn_typ_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpopmassn_typ_werte_code_seq');

SELECT
  setval('apflora.tpopmassn_typ_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpopmassn_typ_werte), FALSE);

ALTER TABLE apflora.tpopmassn_typ_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree(id);

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree(code);

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree(sort);

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree(ansiedlung);

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree(anpflanzung);

CREATE INDEX ON apflora.tpopmassn_typ_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpopmassn_typ_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpopmassn_typ_werte.ansiedlung IS 'Handelt es sich um eine Ansiedlung?';

COMMENT ON COLUMN apflora.tpopmassn_typ_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpopmassn_typ_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpop_entwicklung_werte
DROP TABLE IF EXISTS apflora.tpop_entwicklung_werte;

CREATE TABLE apflora.tpop_entwicklung_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.tpop_entwicklung_werte_code_seq owned BY apflora.tpop_entwicklung_werte.code;

ALTER TABLE apflora.tpop_entwicklung_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.tpop_entwicklung_werte_code_seq');

SELECT
  setval('apflora.tpop_entwicklung_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.tpop_entwicklung_werte), FALSE);

ALTER TABLE apflora.tpop_entwicklung_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree(id);

CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree(code);

CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree(sort);

CREATE INDEX ON apflora.tpop_entwicklung_werte USING btree(historic);

COMMENT ON COLUMN apflora.tpop_entwicklung_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpop_entwicklung_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.tpop_entwicklung_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- projekt
DROP TABLE IF EXISTS apflora.projekt;

CREATE TABLE apflora.projekt(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(150) DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.projekt USING btree(id);

CREATE INDEX ON apflora.projekt USING btree(name);

COMMENT ON COLUMN apflora.projekt.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- this table can not be used as foreign table
-- because it needs to be referenced
DROP TABLE IF EXISTS apflora.ae_taxonomies;

CREATE TABLE apflora.ae_taxonomies(
  taxonomie_id uuid,
  taxonomie_name text,
  id uuid PRIMARY KEY,
  taxid integer,
  taxid_intern integer,
  familie text,
  artname text,
  tax_art_name text,
  artwert integer
);

ALTER TABLE apflora.ae_taxonomies
  ADD COLUMN taxid_intern integer;

CREATE INDEX ON apflora.ae_taxonomies(taxonomie_id);

CREATE INDEX ON apflora.ae_taxonomies(taxonomie_name);

CREATE INDEX ON apflora.ae_taxonomies(id);

CREATE INDEX ON apflora.ae_taxonomies(taxid);

CREATE INDEX ON apflora.ae_taxonomies(taxid_intern);

CREATE INDEX ON apflora.ae_taxonomies(artname);

CREATE INDEX ON apflora.ae_taxonomies(tax_art_name);

-- this one first because of references to it
-- user
DROP TABLE IF EXISTS apflora.user CASCADE;

CREATE TABLE apflora.user(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE,
  -- allow other attributes to be null
  -- so names and roles can be set beforehand by topos
  email text UNIQUE DEFAULT NULL,
  -- enforce role to prevent errors when no role is set
  role name NOT NULL DEFAULT 'apflora_ap_reader',
  pass text DEFAULT NULL,
  adresse_id uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE
  -- reverted created_at and updated_at: authorizing apflora_ap_writer did not work any more!
  --created_at timestamptz NOT NULL DEFAULT now(),
  --updated_at timestamptz NOT NULL DEFAULT now()
  --CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

ALTER TABLE apflora.user
  DROP CONSTRAINT IF EXISTS user_pass_check;

ALTER TABLE apflora.user
  DROP CONSTRAINT IF EXISTS pass_length_minimum_6;

ALTER TABLE apflora.user
  DROP CONSTRAINT IF EXISTS user_role_check;

CREATE INDEX ON apflora.user USING btree(id);

CREATE INDEX ON apflora.user USING btree(name);

CREATE INDEX ON apflora.user USING btree(adresse_id);

COMMENT ON TABLE apflora.user IS 'Konten, um den Zugriff auf apflora.ch zu regeln';

COMMENT ON COLUMN apflora.user.adresse_id IS 'Datensatz bzw. Fremdschlüssel des Users in der Tabelle "adresse". Wird benutzt, damit die EKF-Kontrollen von Freiwilligen-Kontrolleurinnen gefiltert werden können';

ALTER TABLE apflora.user
  ADD COLUMN adresse_id uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE;

-- adresse
DROP TABLE IF EXISTS adresse;

CREATE TABLE apflora.adresse(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text DEFAULT NULL,
  adresse text DEFAULT NULL,
  telefon text DEFAULT NULL,
  email text DEFAULT NULL,
  freiw_erfko boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.adresse USING btree(id);

CREATE INDEX ON apflora.adresse USING btree(name);

CREATE INDEX ON apflora.adresse USING btree(freiw_erfko);


COMMENT ON TABLE apflora.adresse IS 'Adressen, die in anderen Tabellen zugeordent werden können. Nicht zu verwechseln mit Konten, welche den Zugriff auf apflora.ch ermöglichen (Tabelle apflora.user)';

COMMENT ON COLUMN apflora.adresse.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.adresse.name IS 'Vor- und Nachname';

COMMENT ON COLUMN apflora.adresse.adresse IS 'Strasse, PLZ und Ort';

COMMENT ON COLUMN apflora.adresse.telefon IS 'Telefonnummer';

COMMENT ON COLUMN apflora.adresse.email IS 'Email';

COMMENT ON COLUMN apflora.adresse.freiw_erfko IS 'Ist die Person freiwillige(r) Kontrolleur(in)';

COMMENT ON COLUMN apflora.adresse.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ap
DROP TABLE IF EXISTS apflora.ap;

CREATE TABLE apflora.ap(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  art_id uuid UNIQUE DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  proj_id uuid DEFAULT NULL REFERENCES apflora.projekt(id) ON DELETE CASCADE ON UPDATE CASCADE,
  bearbeitung integer DEFAULT NULL REFERENCES apflora.ap_bearbstand_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  start_jahr smallint DEFAULT NULL,
  umsetzung integer DEFAULT NULL REFERENCES apflora.ap_umsetzung_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE,
  ekf_beobachtungszeitpunkt text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.ap USING btree(id);

CREATE INDEX ON apflora.ap USING btree(art_id);

CREATE INDEX ON apflora.ap USING btree(proj_id);

CREATE INDEX ON apflora.ap USING btree(bearbeitung);

CREATE INDEX ON apflora.ap USING btree(start_jahr);

CREATE INDEX ON apflora.ap USING btree(umsetzung);

CREATE INDEX ON apflora.ap USING btree(bearbeiter);

COMMENT ON COLUMN apflora.ap.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ap.proj_id IS 'Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj"';

COMMENT ON COLUMN apflora.ap.art_id IS 'Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert';

COMMENT ON COLUMN apflora.ap.bearbeitung IS 'In welchem Bearbeitungsstand befindet sich der AP?';

COMMENT ON COLUMN apflora.ap.start_jahr IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';

COMMENT ON COLUMN apflora.ap.umsetzung IS 'In welchem Umsetzungsstand befindet sich der AP?';

COMMENT ON COLUMN apflora.ap.bearbeiter IS 'Verantwortliche(r) für die Art';

COMMENT ON COLUMN apflora.ap.ekf_beobachtungszeitpunkt IS 'bester Beobachtungszeitpunkt';

COMMENT ON COLUMN apflora.ap.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.ap_user;

CREATE TABLE apflora.ap_user(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  user_name text DEFAULT NULL REFERENCES apflora.user(name) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ap_id, user_name)
);

CREATE INDEX ON apflora.ap_user USING btree(id);

CREATE INDEX ON apflora.ap_user USING btree(ap_id);

CREATE INDEX ON apflora.ap_user USING btree(user_name);

COMMENT ON TABLE apflora.ap IS 'Hier wird bestimmt, welche Benutzer mit den rollen "apflora_ap_writer" oder "apflora_reader" Zugriff auf eine Art erhalten';

DROP TABLE IF EXISTS apflora.ap_file;

CREATE TABLE apflora.ap_file(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  file_id uuid DEFAULT NULL,
  file_mime_type text DEFAULT NULL,
  name text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.ap USING btree(id);

CREATE INDEX ON apflora.ap_file USING btree(ap_id);

CREATE INDEX ON apflora.ap_file USING btree(file_id);

CREATE INDEX ON apflora.ap_file USING btree(file_mime_type);

-- ap_history
DROP TABLE IF EXISTS apflora.ap_history;

CREATE TABLE apflora.ap_history(
  year integer NOT NULL,
  id uuid NOT NULL,
  art_id uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  proj_id uuid DEFAULT NULL REFERENCES apflora.projekt(id) ON DELETE CASCADE ON UPDATE CASCADE,
  bearbeitung integer DEFAULT NULL REFERENCES apflora.ap_bearbstand_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  start_jahr smallint DEFAULT NULL,
  umsetzung integer DEFAULT NULL REFERENCES apflora.ap_umsetzung_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE,
  ekf_beobachtungszeitpunkt text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL,
  PRIMARY KEY (id, year)
);


--
CREATE INDEX ON apflora.ap_history USING btree(id);

CREATE INDEX ON apflora.ap_history USING btree(year);

CREATE INDEX ON apflora.ap_history USING btree(art_id);

CREATE INDEX ON apflora.ap_history USING btree(proj_id);

CREATE INDEX ON apflora.ap_history USING btree(bearbeitung);

CREATE INDEX ON apflora.ap_history USING btree(start_jahr);

CREATE INDEX ON apflora.ap_history USING btree(umsetzung);

CREATE INDEX ON apflora.ap_history USING btree(bearbeiter);

COMMENT ON COLUMN apflora.ap_history.year IS 'Jahr: ap_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von ap kopiert';

COMMENT ON COLUMN apflora.ap_history.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ap_history.proj_id IS 'Zugehöriges Projekt. Fremdschlüssel aus der Tabelle "proj"';

COMMENT ON COLUMN apflora.ap_history.art_id IS 'Namensgebende Art. Unter ihrem Namen bzw. Nummer werden Kontrollen an InfoFlora geliefert';

COMMENT ON COLUMN apflora.ap_history.bearbeitung IS 'In welchem Bearbeitungsstand befindet sich der AP?';

COMMENT ON COLUMN apflora.ap_history.start_jahr IS 'Wann wurde mit der Umsetzung des Aktionsplans begonnen?';

COMMENT ON COLUMN apflora.ap_history.umsetzung IS 'In welchem Umsetzungsstand befindet sich der AP?';

COMMENT ON COLUMN apflora.ap_history.bearbeiter IS 'Verantwortliche(r) für die Art';

COMMENT ON COLUMN apflora.ap_history.ekf_beobachtungszeitpunkt IS 'bester Beobachtungszeitpunkt';

COMMENT ON COLUMN apflora.ap_history.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ekfrequenz
DROP TABLE IF EXISTS apflora.ekfrequenz;

CREATE TABLE apflora.ekfrequenz(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid NOT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ektyp ek_type DEFAULT NULL,
  anwendungsfall text DEFAULT NULL,
  code text DEFAULT NULL,
  kontrolljahre integer[],
  kontrolljahre_ab ek_kontrolljahre_ab DEFAULT NULL,
  anzahl_min integer DEFAULT NULL,
  anzahl_max integer DEFAULT NULL,
  bemerkungen text DEFAULT NULL,
  sort smallint DEFAULT NULL,
  ek_abrechnungstyp text DEFAULT NULL REFERENCES apflora.ek_abrechnungstyp_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL,
  UNIQUE (ap_id, code)
);

CREATE INDEX ON apflora.ekfrequenz USING btree(id);

CREATE INDEX ON apflora.ekfrequenz USING btree(ap_id);

CREATE INDEX ON apflora.ekfrequenz USING btree(ektyp);

COMMENT ON COLUMN apflora.ekfrequenz.ektyp IS 'Ob diese Frequenz für EK oder EKF anwendbar ist';

CREATE INDEX ON apflora.ekfrequenz USING btree(anwendungsfall);

CREATE INDEX ON apflora.ekfrequenz USING btree(code);

CREATE INDEX ON apflora.ekfrequenz USING btree(kontrolljahre_ab);

COMMENT ON COLUMN apflora.ekfrequenz.kontrolljahre_ab IS 'Referenzjahr für die Kontrolljahre';

CREATE INDEX ON apflora.ekfrequenz USING btree(sort);

CREATE INDEX ON apflora.ekfrequenz USING btree(ek_abrechnungstyp);

COMMENT ON COLUMN apflora.ekfrequenz.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ekfrequenz.ap_id IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.ekfrequenz.anwendungsfall IS 'Beschreibt, in welchen Fällen diese Frequenz angewandt wird. Wahrscheinliche Werte: autochthone Population, angepflanzte Population, angesäte Population, Spezialfall';

COMMENT ON COLUMN apflora.ekfrequenz.code IS 'Definierend für die eqfrequenz';

COMMENT ON COLUMN apflora.ekfrequenz.kontrolljahre IS ' Definiert, in welchen Jahren eine Kontrolle üblicherweise stattfinden soll. Bei Anpflanzungen sind das Jahre ab der letzten Anpflanzung. Bei autochthonen Populationen?';

COMMENT ON COLUMN apflora.ekfrequenz.anzahl_min IS 'Ab dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant. Momentan nicht implementiert, weil Ekfrequenz-Typen nicht automatisch gesetzt werden';

COMMENT ON COLUMN apflora.ekfrequenz.anzahl_max IS 'Bis zu dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant. Momentan nicht implementiert, weil Ekfrequenz-Typen nicht automatisch gesetzt werden';

COMMENT ON COLUMN apflora.ekfrequenz.sort IS 'Damit EK-Zähleinheiten untereinander sortiert werden können';

COMMENT ON COLUMN apflora.ekfrequenz.ek_abrechnungstyp IS 'Fremdschlüssel aus Tabelle ek_abrechnungstyp_werte. Bestimmt, wie Kontrollen abgerechnet werden sollen';

COMMENT ON COLUMN apflora.ekfrequenz.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

-- userprojekt
-- this table is NOT YET IN USE
DROP TABLE IF EXISTS apflora.userprojekt;

CREATE TABLE apflora.userprojekt(
  username varchar(30) REFERENCES apflora.user(name) ON DELETE CASCADE ON UPDATE CASCADE,
  proj_id uuid REFERENCES apflora.projekt(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ALTER TABLE apflora.userprojekt
--   ADD COLUMN created_at timestamptz NOT NULL DEFAULT now();
-- ALTER TABLE apflora.userprojekt
--   ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
DROP TABLE IF EXISTS apflora.ap_bearbstand_werte;

CREATE TABLE apflora.ap_bearbstand_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.ap_bearbstand_werte_code_seq owned BY apflora.ap_bearbstand_werte.code;

ALTER TABLE apflora.ap_bearbstand_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.ap_bearbstand_werte_code_seq');

SELECT
  setval('apflora.ap_bearbstand_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.ap_bearbstand_werte), FALSE);

ALTER TABLE apflora.ap_bearbstand_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.ap_bearbstand_werte USING btree(id);

CREATE INDEX ON apflora.ap_bearbstand_werte USING btree(code);

CREATE INDEX ON apflora.ap_bearbstand_werte USING btree(sort);

CREATE INDEX ON apflora.ap_bearbstand_werte USING btree(historic);

COMMENT ON COLUMN apflora.ap_bearbstand_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ap_bearbstand_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.ap_bearbstand_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ap_erfbeurtkrit_werte
-- this table is not used!!!
DROP TABLE IF EXISTS apflora.ap_erfbeurtkrit_werte;

CREATE TABLE apflora.ap_erfbeurtkrit_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.ap_erfbeurtkrit_werte_code_seq owned BY apflora.ap_erfbeurtkrit_werte.code;

ALTER TABLE apflora.ap_erfbeurtkrit_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.ap_erfbeurtkrit_werte_code_seq');

SELECT
  setval('apflora.ap_erfbeurtkrit_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.ap_erfbeurtkrit_werte), FALSE);

ALTER TABLE apflora.ap_erfbeurtkrit_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree(id);

CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree(code);

CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree(sort);

CREATE INDEX ON apflora.ap_erfbeurtkrit_werte USING btree(historic);

COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.ap_erfbeurtkrit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ap_erfkrit_werte
DROP TABLE IF EXISTS apflora.ap_erfkrit_werte;

CREATE TABLE apflora.ap_erfkrit_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.ap_erfkrit_werte_code_seq owned BY apflora.ap_erfkrit_werte.code;

ALTER TABLE apflora.ap_erfkrit_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.ap_erfkrit_werte_code_seq');

SELECT
  setval('apflora.ap_erfkrit_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.ap_erfkrit_werte), FALSE);

ALTER TABLE apflora.ap_erfkrit_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.ap_erfkrit_werte USING btree(id);

CREATE INDEX ON apflora.ap_erfkrit_werte USING btree(code);

CREATE INDEX ON apflora.ap_erfkrit_werte USING btree(sort);

CREATE INDEX ON apflora.ap_erfkrit_werte USING btree(historic);

COMMENT ON COLUMN apflora.ap_erfkrit_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ap_erfkrit_werte.text IS 'Wie werden die durchgefuehrten Massnahmen beurteilt?';

COMMENT ON COLUMN apflora.ap_erfkrit_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.ap_erfkrit_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- ap_umsetzung_werte
DROP TABLE IF EXISTS apflora.ap_umsetzung_werte;

CREATE TABLE apflora.ap_umsetzung_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(50) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.ap_umsetzung_werte_code_seq owned BY apflora.ap_umsetzung_werte.code;

ALTER TABLE apflora.ap_umsetzung_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.ap_umsetzung_werte_code_seq');

SELECT
  setval('apflora.ap_umsetzung_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.ap_umsetzung_werte), FALSE);

ALTER TABLE apflora.ap_umsetzung_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.ap_umsetzung_werte USING btree(id);

CREATE INDEX ON apflora.ap_umsetzung_werte USING btree(code);

CREATE INDEX ON apflora.ap_umsetzung_werte USING btree(sort);

CREATE INDEX ON apflora.ap_umsetzung_werte USING btree(historic);

COMMENT ON COLUMN apflora.ap_umsetzung_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ap_umsetzung_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.ap_umsetzung_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- apber
DROP TABLE IF EXISTS apflora.apber;

CREATE TABLE apflora.apber(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid NOT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  situation text,
  vergleich_vorjahr_gesamtziel text,
  beurteilung integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  veraenderung_zum_vorjahr varchar(2) DEFAULT NULL,
  -- analyse is a reserved word!!!
  apber_analyse text DEFAULT NULL,
  konsequenzen_umsetzung text,
  konsequenzen_erfolgskontrolle text,
  biotope_neue text,
  biotope_optimieren text,
  massnahmen_optimieren text,
  massnahmen_ap_bearb text,
  massnahmen_planung_vs_ausfuehrung text,
  wirkung_auf_art text,
  datum date DEFAULT NULL,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.apber USING btree(id);

CREATE INDEX ON apflora.apber USING btree(ap_id);

CREATE INDEX ON apflora.apber USING btree(beurteilung);

CREATE INDEX ON apflora.apber USING btree(bearbeiter);

CREATE INDEX ON apflora.apber USING btree(jahr);

COMMENT ON COLUMN apflora.apber.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.apber.jahr IS 'Für welches Jahr gilt der Bericht?';

COMMENT ON COLUMN apflora.apber.situation IS 'Beschreibung der Situation im Berichtjahr. Seit 2017 nicht mehr verwendet: Früher wurden hier die Massnahmen aufgelistet';

COMMENT ON COLUMN apflora.apber.vergleich_vorjahr_gesamtziel IS 'Vergleich zu Vorjahr und Ausblick auf das Gesamtziel';

COMMENT ON COLUMN apflora.apber.beurteilung IS 'Beurteilung des Erfolgs des Aktionsplans bisher';

COMMENT ON COLUMN apflora.apber.veraenderung_zum_vorjahr IS 'Veränderung gegenüber dem Vorjahr: plus heisst aufgestiegen, minus heisst abgestiegen';

COMMENT ON COLUMN apflora.apber.apber_analyse IS 'Was sind die Ursachen fuer die beobachtete Entwicklung?';

COMMENT ON COLUMN apflora.apber.konsequenzen_umsetzung IS 'Konsequenzen für die Umsetzung';

COMMENT ON COLUMN apflora.apber.konsequenzen_erfolgskontrolle IS 'Konsequenzen für die Erfolgskontrolle';

COMMENT ON COLUMN apflora.apber.biotope_neue IS 'Bemerkungen zum Aussagebereich A: Grundmengen und getroffene Massnahmen';

COMMENT ON COLUMN apflora.apber.biotope_optimieren IS 'Bemerkungen zum Aussagebereich B: Bestandeskontrolle';

COMMENT ON COLUMN apflora.apber.massnahmen_optimieren IS 'Bemerkungen zum Aussagebereich C: Zwischenbilanz zur Wirkung von Massnahmen';

COMMENT ON COLUMN apflora.apber.massnahmen_ap_bearb IS 'Bemerkungen zum Aussagebereich C: Weitere Aktivitäten der Art-Verantwortlichen';

COMMENT ON COLUMN apflora.apber.massnahmen_planung_vs_ausfuehrung IS 'Bemerkungen zum Aussagebereich C: Vergleich Ausführung/Planung';

COMMENT ON COLUMN apflora.apber.wirkung_auf_art IS 'Bemerkungen zum Aussagebereich D: Einschätzung der Wirkung des AP insgesamt pro Art';

COMMENT ON COLUMN apflora.apber.datum IS 'Datum der Nachführung';

COMMENT ON COLUMN apflora.apber.bearbeiter IS 'BerichtsverfasserIn: Auswahl aus der Tabelle "adresse"';

COMMENT ON COLUMN apflora.apber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

ALTER TABLE apflora.apber
  ALTER COLUMN changed_by SET DEFAULT NULL;

-- apberuebersicht
DROP TABLE IF EXISTS apflora.apberuebersicht;

CREATE TABLE apflora.apberuebersicht(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proj_id uuid DEFAULT NULL REFERENCES apflora.projekt(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint,
  history_date date DEFAULT NULL,
  history_fixed boolean DEFAULT FALSE,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL,
  UNIQUE (proj_id, jahr)
);

ALTER TABLE apflora.apberuebersicht
  ADD COLUMN IF NOT EXISTS history_fixed boolean DEFAULT FALSE;

CREATE INDEX ON apflora.apberuebersicht USING btree(id);

CREATE INDEX ON apflora.apberuebersicht USING btree(jahr);

CREATE INDEX ON apflora.apberuebersicht USING btree(proj_id);

COMMENT ON COLUMN apflora.apberuebersicht.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.apberuebersicht.proj_id IS 'Zugehöriges Projekt. Zusammen mit jahr eindeutig';

COMMENT ON COLUMN apflora.apberuebersicht.jahr IS 'Berichtsjahr. Zusammen mit proj_id eindeutig';

COMMENT ON COLUMN apflora.apberuebersicht.history_date IS 'Datum, an dem die Daten von Art, Pop und TPop historisiert wurden';

COMMENT ON COLUMN apflora.apberuebersicht.bemerkungen IS 'Bemerkungen zur Artübersicht';

COMMENT ON COLUMN apflora.apberuebersicht.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

ALTER TABLE apflora.apberuebersicht
  ALTER COLUMN changed_by SET DEFAULT NULL;

-- assozart
DROP TABLE IF EXISTS apflora.assozart;

CREATE TABLE apflora.assozart(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  ae_id uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.assozart USING btree(id);

CREATE INDEX ON apflora.assozart USING btree(ap_id);

CREATE INDEX ON apflora.assozart USING btree(ae_id);

COMMENT ON COLUMN apflora.assozart.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.assozart.ap_id IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.assozart.bemerkungen IS 'Bemerkungen zur Assoziation';

COMMENT ON COLUMN apflora.assozart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

ALTER TABLE apflora.assozart
  ALTER COLUMN changed_by SET DEFAULT NULL;

-- erfkrit
DROP TABLE IF EXISTS apflora.erfkrit;

CREATE TABLE apflora.erfkrit(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid NOT NULL DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  erfolg integer DEFAULT NULL REFERENCES apflora.ap_erfkrit_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  kriterien text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.erfkrit USING btree(id);

CREATE INDEX ON apflora.erfkrit USING btree(ap_id);

CREATE INDEX ON apflora.erfkrit USING btree(erfolg);

COMMENT ON COLUMN apflora.erfkrit.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.erfkrit.ap_id IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.erfkrit.erfolg IS 'Wie gut werden die Ziele erreicht? Auswahl aus der Tabelle "ap_erfkrit_werte"';

COMMENT ON COLUMN apflora.erfkrit.kriterien IS 'Beschreibung der Kriterien für den Erfolg';

COMMENT ON COLUMN apflora.erfkrit.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- idealbiotop
DROP TABLE IF EXISTS apflora.idealbiotop;

CREATE TABLE apflora.idealbiotop(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid UNIQUE DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  erstelldatum date DEFAULT NULL,
  hoehenlage text,
  region text,
  exposition text,
  besonnung text,
  hangneigung text,
  boden_typ text,
  boden_kalkgehalt text,
  boden_durchlaessigkeit text,
  boden_humus text,
  boden_naehrstoffgehalt text,
  wasserhaushalt text,
  konkurrenz text,
  moosschicht text,
  krautschicht text,
  strauchschicht text,
  baumschicht text,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.idealbiotop USING btree(id);

CREATE INDEX ON apflora.idealbiotop USING btree(ap_id);

COMMENT ON COLUMN apflora.idealbiotop.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.idealbiotop.ap_id IS 'Fremdschlüssel aus der Tabelle "ap (1:1-Beziehung)';

COMMENT ON COLUMN apflora.idealbiotop.erstelldatum IS 'Erstelldatum';

COMMENT ON COLUMN apflora.idealbiotop.hoehenlage IS 'Höhenlage';

COMMENT ON COLUMN apflora.idealbiotop.region IS 'Region';

COMMENT ON COLUMN apflora.idealbiotop.exposition IS 'Exposition';

COMMENT ON COLUMN apflora.idealbiotop.besonnung IS 'Besonnung';

COMMENT ON COLUMN apflora.idealbiotop.hangneigung IS 'Hangneigung';

COMMENT ON COLUMN apflora.idealbiotop.boden_typ IS 'Bodentyp';

COMMENT ON COLUMN apflora.idealbiotop.boden_kalkgehalt IS 'Kalkgehalt im Boden';

COMMENT ON COLUMN apflora.idealbiotop.boden_durchlaessigkeit IS 'Bodendurchlässigkeit';

COMMENT ON COLUMN apflora.idealbiotop.boden_humus IS 'Bodenhumusgehalt';

COMMENT ON COLUMN apflora.idealbiotop.boden_naehrstoffgehalt IS 'Bodennährstoffgehalt';

COMMENT ON COLUMN apflora.idealbiotop.wasserhaushalt IS 'Wasserhaushalt';

COMMENT ON COLUMN apflora.idealbiotop.konkurrenz IS 'Konkurrenz';

COMMENT ON COLUMN apflora.idealbiotop.moosschicht IS 'Moosschicht';

COMMENT ON COLUMN apflora.idealbiotop.krautschicht IS 'Krautschicht';

COMMENT ON COLUMN apflora.idealbiotop.strauchschicht IS 'Strauchschicht';

COMMENT ON COLUMN apflora.idealbiotop.baumschicht IS 'Baumschicht';

COMMENT ON COLUMN apflora.idealbiotop.bemerkungen IS 'Bemerkungen';

COMMENT ON COLUMN apflora.idealbiotop.changed_by IS 'Wer hat den Datensatz zuletzt verändert?';

DROP TABLE IF EXISTS apflora.idealbiotop_file;

CREATE TABLE apflora.idealbiotop_file(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  idealbiotop_id uuid DEFAULT NULL REFERENCES apflora.idealbiotop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  file_id uuid DEFAULT NULL,
  file_mime_type text DEFAULT NULL,
  name text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.idealbiotop USING btree(id);

CREATE INDEX ON apflora.idealbiotop_file USING btree(idealbiotop_id);

CREATE INDEX ON apflora.idealbiotop_file USING btree(file_id);

CREATE INDEX ON apflora.idealbiotop_file USING btree(file_mime_type);

-- pop
DROP TABLE IF EXISTS apflora.pop;

CREATE TABLE apflora.pop(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  nr integer DEFAULT NULL,
  name varchar(150) DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar boolean DEFAULT FALSE,
  status_unklar_begruendung text DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  geom_point geometry(point, 4326) DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.pop USING btree(geom_point);

CREATE INDEX ON apflora.pop USING btree(id);

CREATE INDEX ON apflora.pop USING btree(ap_id);

CREATE INDEX ON apflora.pop USING btree(status);

CREATE INDEX ON apflora.pop USING btree(nr);

CREATE INDEX ON apflora.pop USING btree(name);

CREATE INDEX ON apflora.pop USING btree(bekannt_seit);

COMMENT ON COLUMN apflora.pop.id IS 'Primärschlüssel der Tabelle "pop"';

COMMENT ON COLUMN apflora.pop.ap_id IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.pop.nr IS 'Nummer der Population';

COMMENT ON COLUMN apflora.pop.name IS 'Bezeichnung der Population';

COMMENT ON COLUMN apflora.pop.status IS 'Herkunft der Population: autochthon oder angesiedelt? Auswahl aus der Tabelle "pop_status_werte"';

COMMENT ON COLUMN apflora.pop.status_unklar IS 'true = die Herkunft der Population ist unklar';

COMMENT ON COLUMN apflora.pop.status_unklar_begruendung IS 'Begründung, wieso die Herkunft unklar ist';

COMMENT ON COLUMN apflora.pop.bekannt_seit IS 'Seit wann ist die Population bekannt?';

COMMENT ON COLUMN apflora.pop.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.pop_file;

CREATE TABLE apflora.pop_file(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  file_id uuid DEFAULT NULL,
  file_mime_type text DEFAULT NULL,
  name text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.pop USING btree(id);

CREATE INDEX ON apflora.pop_file USING btree(pop_id);

CREATE INDEX ON apflora.pop_file USING btree(file_id);

CREATE INDEX ON apflora.pop_file USING btree(file_mime_type);

-- pop_history
DROP TABLE IF EXISTS apflora.pop_history;

CREATE TABLE apflora.pop_history(
  year integer NOT NULL,
  id uuid NOT NULL,
  ap_id uuid DEFAULT NULL,
  nr integer DEFAULT NULL,
  name varchar(150) DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar boolean DEFAULT FALSE,
  status_unklar_begruendung text DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  geom_point geometry(point, 4326) DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL,
  PRIMARY KEY (id, year)
);

ALTER TABLE apflora.pop_history
  DROP CONSTRAINT IF EXISTS fk_ap;

ALTER TABLE apflora.pop_history
  ADD CONSTRAINT fk_ap_history FOREIGN KEY (ap_id, year) REFERENCES apflora.ap_history(id, year) ON DELETE NO action ON UPDATE CASCADE;

CREATE INDEX ON apflora.pop_history USING btree(id);

CREATE INDEX ON apflora.pop_history USING btree(year);

CREATE INDEX ON apflora.pop_history USING btree(ap_id);

CREATE INDEX ON apflora.pop_history USING btree(status);

CREATE INDEX ON apflora.pop_history USING btree(nr);

CREATE INDEX ON apflora.pop_history USING btree(name);

CREATE INDEX ON apflora.pop_history USING btree(bekannt_seit);

COMMENT ON COLUMN apflora.pop_history.year IS 'Jahr: pop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von pop kopiert';

COMMENT ON COLUMN apflora.pop_history.id IS 'Primärschlüssel der Tabelle "pop"';

-- pop_status_werte
DROP TABLE IF EXISTS apflora.pop_status_werte;

CREATE TABLE apflora.pop_status_werte(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code serial,
  text varchar(60) DEFAULT NULL,
  sort smallint DEFAULT NULL,
  historic boolean DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE SEQUENCE apflora.pop_status_werte_code_seq owned BY apflora.pop_status_werte.code;

ALTER TABLE apflora.pop_status_werte
  ALTER COLUMN code SET DEFAULT nextval('apflora.pop_status_werte_code_seq');

SELECT
  setval('apflora.pop_status_werte_code_seq',(
      SELECT
        max(code) + 1 FROM apflora.pop_status_werte), FALSE);

ALTER TABLE apflora.pop_status_werte
  ALTER COLUMN changed_by DROP NOT NULL,
  ALTER COLUMN changed_by SET DEFAULT NULL;

CREATE INDEX ON apflora.pop_status_werte USING btree(id);

CREATE INDEX ON apflora.pop_status_werte USING btree(code);

CREATE INDEX ON apflora.pop_status_werte USING btree(text);

CREATE INDEX ON apflora.pop_status_werte USING btree(sort);

CREATE INDEX ON apflora.pop_status_werte USING btree(historic);

COMMENT ON COLUMN apflora.pop_status_werte.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.pop_status_werte.text IS 'Beschreibung der Herkunft';

COMMENT ON COLUMN apflora.pop_status_werte.historic IS 'Wert wird nur angezeigt, wenn er in den Daten (noch) enthalten ist. Wird in Auswahl-Listen nicht mehr angeboten';

COMMENT ON COLUMN apflora.pop_status_werte.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- popber
DROP TABLE IF EXISTS apflora.popber;

CREATE TABLE apflora.popber(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

COMMENT ON COLUMN apflora.popber.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.popber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';

COMMENT ON COLUMN apflora.popber.jahr IS 'Für welches Jahr gilt der Bericht?';

COMMENT ON COLUMN apflora.popber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';

COMMENT ON COLUMN apflora.popber.bemerkungen IS 'Bemerkungen zur Beurteilung';

COMMENT ON COLUMN apflora.popber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

CREATE INDEX ON apflora.popber USING btree(id);

CREATE INDEX ON apflora.popber USING btree(pop_id);

CREATE INDEX ON apflora.popber USING btree(entwicklung);

CREATE INDEX ON apflora.popber USING btree(jahr);

-- popmassnber
DROP TABLE IF EXISTS apflora.popmassnber;

CREATE TABLE apflora.popmassnber(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  beurteilung integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.popmassnber USING btree(id);

CREATE INDEX ON apflora.popmassnber USING btree(pop_id);

CREATE INDEX ON apflora.popmassnber USING btree(beurteilung);

CREATE INDEX ON apflora.popmassnber USING btree(jahr);

COMMENT ON COLUMN apflora.popmassnber.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.popmassnber.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';

COMMENT ON COLUMN apflora.popmassnber.jahr IS 'Für welches Jahr gilt der Bericht?';

COMMENT ON COLUMN apflora.popmassnber.beurteilung IS 'Wie wird die Wirkung aller im Rahmen des AP durchgeführten Massnahmen beurteilt?';

COMMENT ON COLUMN apflora.popmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';

COMMENT ON COLUMN apflora.popmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- tpop
DROP TABLE IF EXISTS apflora.tpop;

CREATE TABLE apflora.tpop(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pop_id uuid DEFAULT NULL REFERENCES apflora.pop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  nr integer DEFAULT NULL,
  gemeinde text DEFAULT NULL,
  flurname text DEFAULT NULL,
  geom_point geometry(point, 4326) DEFAULT NULL,
  radius smallint DEFAULT NULL,
  hoehe smallint DEFAULT NULL,
  exposition varchar(50) DEFAULT NULL,
  klima varchar(50) DEFAULT NULL,
  neigung varchar(50) DEFAULT NULL,
  boden_typ text DEFAULT NULL,
  boden_kalkgehalt text DEFAULT NULL,
  boden_durchlaessigkeit text DEFAULT NULL,
  boden_humus text DEFAULT NULL,
  boden_naehrstoffgehalt text DEFAULT NULL,
  boden_abtrag text DEFAULT NULL,
  wasserhaushalt text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  kataster_nr text DEFAULT NULL,
  status integer DEFAULT NULL REFERENCES apflora.pop_status_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  status_unklar boolean DEFAULT FALSE,
  status_unklar_grund text DEFAULT NULL,
  apber_relevant boolean DEFAULT TRUE,
  apber_relevant_grund integer DEFAULT NULL REFERENCES apflora.tpop_apberrelevant_grund_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  bekannt_seit smallint DEFAULT NULL,
  eigentuemer text DEFAULT NULL,
  kontakt text DEFAULT NULL,
  nutzungszone text DEFAULT NULL,
  bewirtschafter text DEFAULT NULL,
  bewirtschaftung text DEFAULT NULL,
  ekfrequenz uuid DEFAULT NULL REFERENCES apflora.ekfrequenz(id) ON DELETE SET NULL ON UPDATE CASCADE,
  ekfrequenz_startjahr smallint DEFAULT NULL,
  ekfrequenz_abweichend boolean DEFAULT FALSE,
  ekf_kontrolleur uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.tpop USING btree(geom_point);

CREATE INDEX ON apflora.tpop USING btree(id);

CREATE INDEX ON apflora.tpop USING btree(pop_id);

CREATE INDEX ON apflora.tpop USING btree(status);

CREATE INDEX ON apflora.tpop USING btree(apber_relevant);

CREATE INDEX ON apflora.tpop USING btree(nr);

CREATE INDEX ON apflora.tpop USING btree(flurname);

CREATE INDEX ON apflora.tpop USING btree(ekfrequenz);

CREATE INDEX ON apflora.tpop USING btree(ekfrequenz_abweichend);

CREATE INDEX ON apflora.tpop USING btree(ekf_kontrolleur);

CREATE INDEX ON apflora.tpop USING btree(bekannt_seit);

COMMENT ON COLUMN apflora.tpop.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.tpop.pop_id IS 'Zugehörige Population. Fremdschlüssel aus der Tabelle "pop"';

COMMENT ON COLUMN apflora.tpop.nr IS 'Nummer der Teilpopulation';

COMMENT ON COLUMN apflora.tpop.gemeinde IS 'Gemeinde. Freier Text, Einträge aus apflora.gemeinde sollen gewählt werden können.';

COMMENT ON COLUMN apflora.tpop.flurname IS 'Flurname';

COMMENT ON COLUMN apflora.tpop.radius IS 'Radius der Teilpopulation (m)';

COMMENT ON COLUMN apflora.tpop.hoehe IS 'Höhe über Meer (m)';

COMMENT ON COLUMN apflora.tpop.exposition IS 'Exposition / Besonnung des Standorts';

COMMENT ON COLUMN apflora.tpop.klima IS 'Klima des Standorts';

COMMENT ON COLUMN apflora.tpop.neigung IS 'Hangneigung des Standorts';

COMMENT ON COLUMN apflora.tpop.boden_typ IS 'Bodentyp';

COMMENT ON COLUMN apflora.tpop.boden_kalkgehalt IS 'Kalkgehalt des Bodens';

COMMENT ON COLUMN apflora.tpop.boden_durchlaessigkeit IS 'Durchlässigkeit des Bodens';

COMMENT ON COLUMN apflora.tpop.boden_humus IS 'Humusgehalt des Bodens';

COMMENT ON COLUMN apflora.tpop.boden_naehrstoffgehalt IS 'Nährstoffgehalt des Bodens';

COMMENT ON COLUMN apflora.tpop.boden_abtrag IS 'Oberbodenabtrag';

COMMENT ON COLUMN apflora.tpop.wasserhaushalt IS 'Wasserhaushalt';

COMMENT ON COLUMN apflora.tpop.beschreibung IS 'Beschreibung der Fläche';

COMMENT ON COLUMN apflora.tpop.kataster_nr IS 'Kataster-Nummer';

COMMENT ON COLUMN apflora.tpop.status IS 'Herkunft der Teilpopulation. Auswahl aus Tabelle "pop_status_werte"';

COMMENT ON COLUMN apflora.tpop.status_unklar IS 'Ist der Status der Teilpopulation unklar? (es bestehen keine glaubwuerdigen Beboachtungen)';

COMMENT ON COLUMN apflora.tpop.status_unklar_grund IS 'Wieso ist der Status unklar?';

COMMENT ON COLUMN apflora.tpop.apber_relevant_grund IS 'Grund für AP-Bericht Relevanz. Auswahl aus der Tabelle "tpop_apberrelevant_grund_werte"';

COMMENT ON COLUMN apflora.tpop.bekannt_seit IS 'Seit wann ist die Teilpopulation bekannt?';

COMMENT ON COLUMN apflora.tpop.eigentuemer IS 'EigentümerIn';

COMMENT ON COLUMN apflora.tpop.kontakt IS 'Kontaktperson vor Ort';

COMMENT ON COLUMN apflora.tpop.nutzungszone IS 'Nutzungszone';

COMMENT ON COLUMN apflora.tpop.bewirtschafter IS 'Wer bewirtschaftet die Fläche?';

COMMENT ON COLUMN apflora.tpop.bewirtschaftung IS 'Wie wird die Fläche bewirtschaftet?';

COMMENT ON COLUMN apflora.tpop.bemerkungen IS 'Bemerkungen zur Teilpopulation';

COMMENT ON COLUMN apflora.tpop.ekfrequenz IS 'Wert aus Tabelle ekfrequenz. Bestimmt, wie häufig kontrolliert werden soll';

COMMENT ON COLUMN apflora.tpop.ekfrequenz_startjahr IS 'Das Basisjahr, von dem aus ekpläne gemäss eqfrequenz gesetzt werden';

COMMENT ON COLUMN apflora.tpop.ekfrequenz_abweichend IS 'Diese Frequenz entspricht nicht derjenigen, welche gemäss Populationsgrösse vergeben worden wäre';

COMMENT ON COLUMN apflora.tpop.ekfrequenz_abweichend IS 'Wer diese TPop freiwillig kontrolliert. Dient dazu, Formulare für die EKF zu generieren';

DROP TABLE IF EXISTS apflora.tpop_file;

CREATE TABLE apflora.tpop_file(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  file_id uuid DEFAULT NULL,
  file_mime_type text DEFAULT NULL,
  name text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.tpop USING btree(id);

CREATE INDEX ON apflora.tpop_file USING btree(tpop_id);

CREATE INDEX ON apflora.tpop_file USING btree(file_id);

CREATE INDEX ON apflora.tpop_file USING btree(file_mime_type);

-- tpop_history
DROP TABLE IF EXISTS apflora.tpop_history;

CREATE TABLE apflora.tpop_history(
  year integer NOT NULL,
  id uuid NOT NULL,
  pop_id uuid DEFAULT NULL,
  nr integer DEFAULT NULL,
  gemeinde text DEFAULT NULL,
  flurname text DEFAULT NULL,
  geom_point geometry(point, 4326) DEFAULT NULL,
  radius smallint DEFAULT NULL,
  hoehe smallint DEFAULT NULL,
  exposition varchar(50) DEFAULT NULL,
  klima varchar(50) DEFAULT NULL,
  neigung varchar(50) DEFAULT NULL,
  boden_typ text DEFAULT NULL,
  boden_kalkgehalt text DEFAULT NULL,
  boden_durchlaessigkeit text DEFAULT NULL,
  boden_humus text DEFAULT NULL,
  boden_naehrstoffgehalt text DEFAULT NULL,
  boden_abtrag text DEFAULT NULL,
  wasserhaushalt text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  kataster_nr text DEFAULT NULL,
  status integer DEFAULT NULL,
  status_unklar boolean DEFAULT FALSE,
  status_unklar_grund text DEFAULT NULL,
  apber_relevant boolean DEFAULT TRUE,
  apber_relevant_grund integer DEFAULT NULL,
  bekannt_seit smallint DEFAULT NULL,
  eigentuemer text DEFAULT NULL,
  kontakt text DEFAULT NULL,
  nutzungszone text DEFAULT NULL,
  bewirtschafter text DEFAULT NULL,
  bewirtschaftung text DEFAULT NULL,
  ekfrequenz uuid DEFAULT NULL,
  ekfrequenz_startjahr smallint DEFAULT NULL,
  ekfrequenz_abweichend boolean DEFAULT FALSE,
  ekf_kontrolleur uuid DEFAULT NULL,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL,
  PRIMARY KEY (id, year)
);

ALTER TABLE apflora.tpop_history
  ADD CONSTRAINT fk_pop_history FOREIGN KEY (year, pop_id) REFERENCES apflora.pop_history(year, id) ON DELETE NO ACTION ON UPDATE NO ACTION;


--
CREATE INDEX ON apflora.tpop_history USING btree(id);

CREATE INDEX ON apflora.tpop_history USING btree(year);

CREATE INDEX ON apflora.tpop_history USING btree(pop_id);

CREATE INDEX ON apflora.tpop_history USING btree(status);

CREATE INDEX ON apflora.tpop_history USING btree(apber_relevant);

CREATE INDEX ON apflora.tpop_history USING btree(bekannt_seit);

CREATE INDEX ON apflora.tpop_history USING btree(nr);

CREATE INDEX ON apflora.tpop_history USING btree(flurname);

CREATE INDEX ON apflora.tpop_history USING btree(ekf_kontrolleur);

CREATE INDEX ON apflora.tpop_history USING btree(ekfrequenz);

CREATE INDEX ON apflora.tpop_history USING btree(apber_relevant_grund);

COMMENT ON COLUMN apflora.tpop_history.year IS 'Jahr: tpop_history wurde beim Erstellen des Jahresberichts im Februar des Folgejahrs von tpop kopiert';

COMMENT ON COLUMN apflora.tpop_history.id IS 'Primärschlüssel der Tabelle tpop';

-- tpopber
DROP TABLE IF EXISTS apflora.tpopber;

CREATE TABLE apflora.tpopber(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

COMMENT ON COLUMN apflora.tpopber.id IS 'Primärschlüssel der Tabelle "tpopber"';

COMMENT ON COLUMN apflora.tpopber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel der Tabelle "tpop"';

COMMENT ON COLUMN apflora.tpopber.jahr IS 'Für welches Jahr gilt der Bericht?';

COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Beurteilung der Populationsentwicklung: Auswahl aus Tabelle "tpop_entwicklung_werte"';

COMMENT ON COLUMN apflora.tpopber.entwicklung IS 'Bemerkungen zur Beurteilung';

COMMENT ON COLUMN apflora.tpopber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

CREATE INDEX ON apflora.tpopber USING btree(id);

CREATE INDEX ON apflora.tpopber USING btree(tpop_id);

CREATE INDEX ON apflora.tpopber USING btree(entwicklung);

CREATE INDEX ON apflora.tpopber USING btree(jahr);

-- tpopkontr
DROP TABLE IF EXISTS apflora.tpopkontr;

CREATE TABLE apflora.tpopkontr(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ varchar(50) DEFAULT NULL REFERENCES apflora.tpopkontr_typ_werte(text) ON DELETE SET NULL ON UPDATE CASCADE,
  datum date DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE,
  vitalitaet text DEFAULT NULL,
  ueberlebensrate smallint DEFAULT NULL,
  entwicklung integer DEFAULT NULL REFERENCES apflora.tpop_entwicklung_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  ursachen text DEFAULT NULL,
  erfolgsbeurteilung text DEFAULT NULL,
  umsetzung_aendern text DEFAULT NULL,
  kontrolle_aendern text DEFAULT NULL,
  bemerkungen text,
  lr_delarze text DEFAULT NULL,
  flaeche integer DEFAULT NULL,
  lr_umgebung_delarze text DEFAULT NULL,
  vegetationstyp varchar(100) DEFAULT NULL,
  konkurrenz varchar(100) DEFAULT NULL,
  moosschicht varchar(100) DEFAULT NULL,
  krautschicht varchar(100) DEFAULT NULL,
  strauchschicht text DEFAULT NULL,
  baumschicht varchar(100) DEFAULT NULL,
  idealbiotop_uebereinstimmung integer DEFAULT NULL REFERENCES apflora.tpopkontr_idbiotuebereinst_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  handlungsbedarf text,
  flaeche_ueberprueft integer DEFAULT NULL,
  plan_vorhanden boolean DEFAULT FALSE,
  deckung_vegetation smallint DEFAULT NULL,
  deckung_nackter_boden smallint DEFAULT NULL,
  deckung_ap_art smallint DEFAULT NULL,
  jungpflanzen_vorhanden boolean DEFAULT NULL,
  vegetationshoehe_maximum smallint DEFAULT NULL,
  vegetationshoehe_mittel smallint DEFAULT NULL,
  gefaehrdung text DEFAULT NULL,
  apber_nicht_relevant boolean DEFAULT NULL,
  apber_nicht_relevant_grund text DEFAULT NULL,
  ekf_bemerkungen text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.tpopkontr USING btree(id);

CREATE INDEX ON apflora.tpopkontr USING btree(tpop_id);

CREATE INDEX ON apflora.tpopkontr USING btree(bearbeiter);

CREATE INDEX ON apflora.tpopkontr USING btree(entwicklung);

CREATE INDEX ON apflora.tpopkontr USING btree(idealbiotop_uebereinstimmung);

CREATE INDEX ON apflora.tpopkontr USING btree(jahr);

CREATE INDEX ON apflora.tpopkontr USING btree(typ);

CREATE INDEX ON apflora.tpopkontr USING btree(datum);

CREATE INDEX ON apflora.tpopkontr USING btree(apber_nicht_relevant);

COMMENT ON COLUMN apflora.tpopkontr.id IS 'Primärschlüssel. Wird u.a. verwendet für die Identifikation der Beobachtung im nationalen Beobachtungs-Daten-Kreislauf';

COMMENT ON COLUMN apflora.tpopkontr.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';

COMMENT ON COLUMN apflora.tpopkontr.typ IS 'Typ der Kontrolle. Auswahl aus Tabelle "tpopkontr_typ_werte"';

COMMENT ON COLUMN apflora.tpopkontr.datum IS 'Wann wurde kontrolliert?';

COMMENT ON COLUMN apflora.tpopkontr.jahr IS 'In welchem Jahr wurde kontrolliert? Für welches Jahr gilt die Beschreibung?';

COMMENT ON COLUMN apflora.tpopkontr.bearbeiter IS 'Wer hat kontrolliert? Auswahl aus Tabelle "adresse"';

COMMENT ON COLUMN apflora.tpopkontr.vitalitaet IS 'Vitalität der Pflanzen';

COMMENT ON COLUMN apflora.tpopkontr.ueberlebensrate IS 'Überlebensrate in Prozent';

COMMENT ON COLUMN apflora.tpopkontr.entwicklung IS 'Entwicklung des Bestandes. Auswahl aus Tabelle "tpop_entwicklung_werte"';

COMMENT ON COLUMN apflora.tpopkontr.ursachen IS 'Ursachen der Entwicklung';

COMMENT ON COLUMN apflora.tpopkontr.erfolgsbeurteilung IS 'Erfolgsbeurteilung';

COMMENT ON COLUMN apflora.tpopkontr.umsetzung_aendern IS 'Vorschlag für Änderung der Umsetzung';

COMMENT ON COLUMN apflora.tpopkontr.kontrolle_aendern IS 'Vorschlag für Änderung der Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.bemerkungen IS 'Bemerkungen zur Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.lr_delarze IS 'Lebensraumtyp nach Delarze';

COMMENT ON COLUMN apflora.tpopkontr.flaeche IS 'Fläche der Teilpopulation';

COMMENT ON COLUMN apflora.tpopkontr.lr_umgebung_delarze IS 'Lebensraumtyp der direkt angrenzenden Umgebung (nach Delarze)';

COMMENT ON COLUMN apflora.tpopkontr.vegetationstyp IS 'Vegetationstyp';

COMMENT ON COLUMN apflora.tpopkontr.konkurrenz IS 'Konkurrenz';

COMMENT ON COLUMN apflora.tpopkontr.moosschicht IS 'Moosschicht';

COMMENT ON COLUMN apflora.tpopkontr.krautschicht IS 'Krautschicht';

COMMENT ON COLUMN apflora.tpopkontr.strauchschicht IS 'Strauchschicht, ehemals Verbuschung (%)';

COMMENT ON COLUMN apflora.tpopkontr.baumschicht IS 'Baumschicht';

COMMENT ON COLUMN apflora.tpopkontr.idealbiotop_uebereinstimmung IS 'Übereinstimmung mit dem Idealbiotop';

COMMENT ON COLUMN apflora.tpopkontr.handlungsbedarf IS 'Handlungsbedarf bezüglich Biotop';

COMMENT ON COLUMN apflora.tpopkontr.flaeche_ueberprueft IS 'Überprüfte Fläche in m2. Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.plan_vorhanden IS 'Fläche / Wuchsort auf Plan eingezeichnet? Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.deckung_vegetation IS 'Von Pflanzen, Streu oder Moos bedeckter Boden (%). Nur für Freiwilligen-Erfolgskontrolle. Nur bis 2012 erfasst.';

COMMENT ON COLUMN apflora.tpopkontr.deckung_nackter_boden IS 'Flächenanteil nackter Boden (%). Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.deckung_ap_art IS 'Flächenanteil der überprüften Pflanzenart (%). Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.jungpflanzen_vorhanden IS 'Gibt es neben alten Pflanzen auch junge? EK & EKF';

COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_maximum IS 'Maximale Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.vegetationshoehe_mittel IS 'Mittlere Vegetationshöhe in cm. Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.gefaehrdung IS 'Gefährdung. Nur für Freiwilligen-Erfolgskontrolle';

COMMENT ON COLUMN apflora.tpopkontr.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

COMMENT ON COLUMN apflora.tpopkontr.apber_nicht_relevant IS 'Pro Jahr sollte maximal eine Kontrolle AP-Bericht-relevant sein. Dient dazu Kontrollen auszuschliessen';

COMMENT ON COLUMN apflora.tpopkontr.apber_nicht_relevant_grund IS 'Grund, wieso die Kontrolle vom AP-Bericht ausgeschlossen wurde';

DROP TABLE IF EXISTS apflora.tpopkontr_file;

CREATE TABLE apflora.tpopkontr_file(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpopkontr_id uuid DEFAULT NULL REFERENCES apflora.tpopkontr(id) ON DELETE CASCADE ON UPDATE CASCADE,
  file_id uuid DEFAULT NULL,
  file_mime_type text DEFAULT NULL,
  name text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.tpopkontr USING btree(id);

CREATE INDEX ON apflora.tpopkontr_file USING btree(tpopkontr_id);

CREATE INDEX ON apflora.tpopkontr_file USING btree(file_id);

CREATE INDEX ON apflora.tpopkontr_file USING btree(file_mime_type);

-- tpopkontrzaehl
DROP TABLE IF EXISTS apflora.tpopkontrzaehl;

CREATE TABLE apflora.tpopkontrzaehl(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpopkontr_id uuid DEFAULT NULL REFERENCES apflora.tpopkontr(id) ON DELETE CASCADE ON UPDATE CASCADE,
  anzahl real DEFAULT NULL,
  einheit integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  methode integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_methode_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL,
  UNIQUE (id, einheit)
);

-- 2019 10 29: alter table apflora.tpopkontrzaehl add constraint id_einheit_unique unique (id, einheit);
COMMENT ON COLUMN apflora.tpopkontrzaehl.anzahl IS 'Anzahl Zaehleinheiten';

COMMENT ON COLUMN apflora.tpopkontrzaehl.einheit IS 'Verwendete Zaehleinheit. Auswahl aus Tabelle "tpopkontrzaehl_einheit_werte"';

COMMENT ON COLUMN apflora.tpopkontrzaehl.methode IS 'Verwendete Methodik. Auswahl aus Tabelle "tpopkontrzaehl_methode_werte"';

COMMENT ON COLUMN apflora.tpopkontrzaehl.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

CREATE INDEX ON apflora.tpopkontrzaehl USING btree(id);

CREATE INDEX ON apflora.tpopkontrzaehl USING btree(tpopkontr_id);

CREATE INDEX ON apflora.tpopkontrzaehl USING btree(anzahl);

CREATE INDEX ON apflora.tpopkontrzaehl USING btree(einheit);

CREATE INDEX ON apflora.tpopkontrzaehl USING btree(methode);

-- tpopmassn
DROP TABLE IF EXISTS apflora.tpopmassn;

CREATE TABLE apflora.tpopmassn(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ integer DEFAULT NULL REFERENCES apflora.tpopmassn_typ_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  beschreibung text DEFAULT NULL,
  jahr smallint DEFAULT NULL,
  datum date DEFAULT NULL,
  bearbeiter uuid DEFAULT NULL REFERENCES apflora.adresse(id) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  plan_vorhanden boolean DEFAULT FALSE,
  plan_bezeichnung text DEFAULT NULL,
  flaeche real DEFAULT NULL,
  markierung text DEFAULT NULL,
  anz_triebe integer DEFAULT NULL,
  anz_pflanzen integer DEFAULT NULL,
  anz_pflanzstellen integer DEFAULT NULL,
  zieleinheit_einheit integer DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  zieleinheit_anzahl integer DEFAULT NULL,
  wirtspflanze text DEFAULT NULL,
  herkunft_pop text DEFAULT NULL,
  sammeldatum varchar(50) DEFAULT NULL,
  von_anzahl_individuen integer DEFAULT NULL,
  form text DEFAULT NULL,
  pflanzanordnung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE UNIQUE INDEX ON apflora.tpopmassn USING btree(id);

CREATE INDEX ON apflora.tpopmassn USING btree(tpop_id);

CREATE INDEX ON apflora.tpopmassn USING btree(bearbeiter);

CREATE INDEX ON apflora.tpopmassn USING btree(typ);

CREATE INDEX ON apflora.tpopmassn USING btree(jahr);

COMMENT ON COLUMN apflora.tpopmassn.id IS 'Primärschlüssel der Tabelle "tpopmassn"';

COMMENT ON COLUMN apflora.tpopmassn.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus der Tabelle "tpop"';

COMMENT ON COLUMN apflora.tpopmassn.typ IS 'Typ der Massnahme. Auswahl aus Tabelle "tpopmassn_typ_werte"';

COMMENT ON COLUMN apflora.tpopmassn.beschreibung IS 'Was wurde gemacht? V.a. für Typ "Spezial"';

COMMENT ON COLUMN apflora.tpopmassn.jahr IS 'Jahr, in dem die Massnahme durchgeführt wurde';

COMMENT ON COLUMN apflora.tpopmassn.datum IS 'Datum, an dem die Massnahme durchgeführt wurde';

COMMENT ON COLUMN apflora.tpopmassn.bearbeiter IS 'Verantwortliche BearbeiterIn. Auswahl aus Tabelle "adresse"';

COMMENT ON COLUMN apflora.tpopmassn.bemerkungen IS 'Bemerkungen zur Massnahme';

COMMENT ON COLUMN apflora.tpopmassn.plan_vorhanden IS 'Existiert ein Plan?';

COMMENT ON COLUMN apflora.tpopmassn.plan_bezeichnung IS 'Bezeichnung auf dem Plan';

COMMENT ON COLUMN apflora.tpopmassn.flaeche IS 'Fläche der Massnahme bzw. Teilpopulation (m2)';

COMMENT ON COLUMN apflora.tpopmassn.markierung IS 'Markierung der Massnahme bzw. Teilpopulation';

COMMENT ON COLUMN apflora.tpopmassn.anz_triebe IS 'Anzahl angesiedelte Triebe';

COMMENT ON COLUMN apflora.tpopmassn.anz_pflanzen IS 'Anzahl angesiedelte Pflanzen';

COMMENT ON COLUMN apflora.tpopmassn.anz_pflanzstellen IS 'Anzahl Töpfe/Pflanzstellen';

COMMENT ON COLUMN apflora.tpopmassn.zieleinheit_einheit IS 'Gezählte Zieleinheit';

COMMENT ON COLUMN apflora.tpopmassn.zieleinheit_anzahl IS 'Anzahl Zieleinheiten';

COMMENT ON COLUMN apflora.tpopmassn.wirtspflanze IS 'Wirtspflanze';

COMMENT ON COLUMN apflora.tpopmassn.herkunft_pop IS 'Aus welcher Population stammt das Pflanzenmaterial?';

COMMENT ON COLUMN apflora.tpopmassn.sammeldatum IS 'Datum, an dem die angesiedelten Pflanzen gesammelt wurden';

COMMENT ON COLUMN apflora.tpopmassn.von_anzahl_individuen IS 'Anzahl besammelte Individuen der Herkunftspopulation';

COMMENT ON COLUMN apflora.tpopmassn.form IS 'Form, Grösse der Ansiedlung';

COMMENT ON COLUMN apflora.tpopmassn.pflanzanordnung IS 'Anordnung der Pflanzung';

COMMENT ON COLUMN apflora.tpopmassn.id IS 'GUID der Tabelle "tpopmassn"';

COMMENT ON COLUMN apflora.tpopmassn.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.tpopmassn_file;

CREATE TABLE apflora.tpopmassn_file(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpopmassn_id uuid DEFAULT NULL REFERENCES apflora.tpopmassn(id) ON DELETE CASCADE ON UPDATE CASCADE,
  file_id uuid DEFAULT NULL,
  file_mime_type text DEFAULT NULL,
  name text DEFAULT NULL,
  beschreibung text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.tpopmassn USING btree(id);

CREATE INDEX ON apflora.tpopmassn_file USING btree(tpopmassn_id);

CREATE INDEX ON apflora.tpopmassn_file USING btree(file_id);

CREATE INDEX ON apflora.tpopmassn_file USING btree(file_mime_type);

-- tpopmassnber
DROP TABLE IF EXISTS apflora.tpopmassnber;

CREATE TABLE apflora.tpopmassnber(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  beurteilung integer DEFAULT NULL REFERENCES apflora.tpopmassn_erfbeurt_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.tpopmassnber USING btree(id);

CREATE INDEX ON apflora.tpopmassnber USING btree(tpop_id);

CREATE INDEX ON apflora.tpopmassnber USING btree(beurteilung);

CREATE INDEX ON apflora.tpopmassnber USING btree(jahr);

COMMENT ON COLUMN apflora.tpopmassnber.id IS 'Primärschlüssel der Tabelle "tpopmassnber"';

COMMENT ON COLUMN apflora.tpopmassnber.tpop_id IS 'Zugehörige Teilpopulation. Fremdschlüssel aus Tabelle "tpop"';

COMMENT ON COLUMN apflora.tpopmassnber.jahr IS 'Jahr, für den der Bericht gilt';

COMMENT ON COLUMN apflora.tpopmassnber.beurteilung IS 'Beurteilung des Erfolgs. Auswahl aus Tabelle "tpopmassn_erfbeurt_werte"';

COMMENT ON COLUMN apflora.tpopmassnber.bemerkungen IS 'Bemerkungen zur Beurteilung';

COMMENT ON COLUMN apflora.tpopmassnber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- message
DROP TABLE IF EXISTS apflora.message CASCADE;

CREATE TABLE apflora.message(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  time timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- active is used to prevent to many datasets fro being fetched
  -- old messages can be set inactive, expecially if read by all
  active boolean NOT NULL DEFAULT TRUE
);

CREATE INDEX ON apflora.message USING btree(id);

CREATE INDEX ON apflora.message USING btree(time);

COMMENT ON COLUMN apflora.message.message IS 'Nachricht an die Benutzer';

COMMENT ON COLUMN apflora.message.active IS 'false: diese Nachricht wird nicht mehr übermittelt';

-- currentIssue
DROP TABLE IF EXISTS apflora.currentIssue CASCADE;

CREATE TABLE apflora.currentIssue(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sort smallint DEFAULT NULL,
  title text DEFAULT NULL,
  issue text DEFAULT NULL
);

CREATE INDEX ON apflora.currentIssue USING btree(id);

CREATE INDEX ON apflora.currentIssue USING btree(sort);

CREATE INDEX ON apflora.currentIssue USING btree(title);

COMMENT ON COLUMN apflora.currentIssue.issue IS 'Bekannter Fehler';

-- usermessage
-- list of read messages per user
DROP TABLE IF EXISTS apflora.usermessage;

CREATE TABLE apflora.usermessage(
  user_name varchar(30) NOT NULL REFERENCES apflora.user(name) ON DELETE CASCADE ON UPDATE CASCADE,
  message_id uuid NOT NULL REFERENCES apflora.message(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE (user_name, message_id)
);

CREATE INDEX ON apflora.usermessage USING btree(id);

CREATE INDEX ON apflora.usermessage USING btree(user_name);

CREATE INDEX ON apflora.usermessage USING btree(message_id);

-- ziel
DROP TABLE IF EXISTS apflora.ziel;

CREATE TABLE apflora.ziel(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid NOT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  typ integer DEFAULT NULL REFERENCES apflora.ziel_typ_werte(code) ON DELETE SET NULL ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  bezeichnung text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.ziel USING btree(id);

CREATE INDEX ON apflora.ziel USING btree(ap_id);

CREATE INDEX ON apflora.ziel USING btree(typ);

CREATE INDEX ON apflora.ziel USING btree(jahr);

COMMENT ON COLUMN apflora.ziel.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ziel.ap_id IS 'Zugehörige Art. Fremdschluessel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.ziel.typ IS 'Typ des Ziels. Z.B. Zwischenziel, Gesamtziel. Auswahl aus Tabelle "ziel_typ_werte"';

COMMENT ON COLUMN apflora.ziel.jahr IS 'In welchem Jahr soll das Ziel erreicht werden?';

COMMENT ON COLUMN apflora.ziel.bezeichnung IS 'Textliche Beschreibung des Ziels';

COMMENT ON COLUMN apflora.ziel.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- zielber
DROP TABLE IF EXISTS apflora.zielber;

CREATE TABLE apflora.zielber(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ziel_id uuid DEFAULT NULL REFERENCES apflora.ziel(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  erreichung text DEFAULT NULL,
  bemerkungen text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.zielber USING btree(id);

CREATE INDEX ON apflora.zielber USING btree(ziel_id);

CREATE INDEX ON apflora.zielber USING btree(jahr);

COMMENT ON COLUMN apflora.zielber.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.zielber.ziel_id IS 'Zugehöriges Ziel. Fremdschlüssel aus der Tabelle "ziel"';

COMMENT ON COLUMN apflora.zielber.jahr IS 'Für welches Jahr gilt der Bericht?';

COMMENT ON COLUMN apflora.zielber.erreichung IS 'Beurteilung der Zielerreichung';

COMMENT ON COLUMN apflora.zielber.bemerkungen IS 'Bemerkungen zur Zielerreichung';

COMMENT ON COLUMN apflora.zielber.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

-- beob
DROP TABLE IF EXISTS apflora.beob;

CREATE TABLE apflora.beob(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quelle text DEFAULT NULL,
  -- this field in data contains this datasets id
  id_field varchar(38) DEFAULT NULL,
  id_original text DEFAULT NULL,
  id_evab text DEFAULT NULL,
  id_evab_lc text DEFAULT NULL,
  obs_id bigint DEFAULT NULL,
  art_id uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  -- art_id can be changed. art_id_original documents this change
  art_id_original uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO action ON UPDATE CASCADE,
  -- data without year is not imported
  -- when no month exists: month = 01
  -- when no day exists: day = 01
  datum date DEFAULT NULL,
  -- Nachname Vorname
  autor varchar(100) DEFAULT NULL,
  -- data without coordinates is not imported
  geom_point geometry(point, 4326) DEFAULT NULL,
  -- maybe later add a geojson field for polygons?
  data jsonb,
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE SET NULL ON UPDATE CASCADE,
  nicht_zuordnen boolean DEFAULT FALSE,
  infoflora_informiert_datum date DEFAULT NULL,
  bemerkungen text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.beob USING btree(geom_point);

CREATE INDEX ON apflora.beob USING btree(id);

CREATE INDEX ON apflora.beob USING btree(id_original);

CREATE INDEX ON apflora.beob USING btree(obs_id);

CREATE INDEX ON apflora.beob USING btree(art_id);

CREATE INDEX ON apflora.beob USING btree(art_id_original);

CREATE INDEX ON apflora.beob USING btree(quelle);

CREATE INDEX ON apflora.beob USING btree(tpop_id);

CREATE INDEX ON apflora.beob USING btree(nicht_zuordnen);

CREATE INDEX ON apflora.beob USING btree(infoflora_informiert_datum);

COMMENT ON COLUMN apflora.beob.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.beob.tpop_id IS 'Dieser Teilpopulation wurde die Beobachtung zugeordnet. Fremdschlüssel aus der Tabelle "tpop"';

COMMENT ON COLUMN apflora.beob.nicht_zuordnen IS 'Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar';

COMMENT ON COLUMN apflora.beob.infoflora_informiert_datum IS 'Datum, an dem Info Flora über die Verifikation der Beobachtung informiert wurde';

COMMENT ON COLUMN apflora.beob.bemerkungen IS 'Bemerkungen zur Zuordnung';

COMMENT ON COLUMN apflora.beob.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

COMMENT ON COLUMN apflora.beob.id_evab IS 'Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen';

COMMENT ON COLUMN apflora.beob.id_evab_lc IS 'Einmalig? für die Bereinigung von Beobachtungen benutzt, die von Info Flora von EvAB her kamen';

-- beobprojekt
-- is used to control what beob are seen in what projekt
-- IT IS NOT YET USED!
DROP TABLE IF EXISTS apflora.beobprojekt;

CREATE TABLE apflora.beobprojekt(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proj_id uuid NOT NULL REFERENCES apflora.projekt(id) ON DELETE SET NULL ON UPDATE CASCADE,
  beob_id uuid NOT NULL REFERENCES apflora.beob(id) ON DELETE SET NULL ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (proj_id, beob_id)
);

-- apart
DROP TABLE IF EXISTS apflora.apart;

CREATE TABLE apflora.apart(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  art_id uuid DEFAULT NULL REFERENCES apflora.ae_taxonomies(id) ON DELETE NO ACTION ON UPDATE CASCADE,
  ap_id uuid DEFAULT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL --UNIQUE (art_id) --no, maybe after beob were rearranged
);

CREATE INDEX ON apflora.apart USING btree(id);

CREATE INDEX ON apflora.apart USING btree(ap_id);

CREATE INDEX ON apflora.apart USING btree(art_id);

COMMENT ON COLUMN apflora.apart.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.apart.art_id IS 'Zugehörige Art. Aus der Tabelle "ae_taxonomies"';

COMMENT ON COLUMN apflora.apart.ap_id IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.apart.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

-- ekzaehleinheit
DROP TABLE IF EXISTS apflora.ekzaehleinheit;

CREATE TABLE apflora.ekzaehleinheit(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ap_id uuid NOT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  zaehleinheit_id uuid DEFAULT NULL REFERENCES apflora.tpopkontrzaehl_einheit_werte(id) ON DELETE CASCADE ON UPDATE CASCADE,
  zielrelevant boolean DEFAULT FALSE,
  not_massn_count_unit boolean DEFAULT FALSE,
  sort smallint DEFAULT NULL,
  bemerkungen text DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE UNIQUE INDEX ekzaehleinheit_single_zielrelevant_for_ap_idx ON apflora.ekzaehleinheit(ap_id, zielrelevant)
WHERE
  zielrelevant = 'true';

CREATE UNIQUE INDEX ekzaehleinheit_zaehleinheit_unique_for_ap_idx ON apflora.ekzaehleinheit(ap_id, zaehleinheit_id);

CREATE INDEX ON apflora.ekzaehleinheit USING btree(id);

CREATE INDEX ON apflora.ekzaehleinheit USING btree(ap_id);

CREATE INDEX ON apflora.ekzaehleinheit USING btree(zaehleinheit_id);

CREATE INDEX ON apflora.ekzaehleinheit USING btree(not_massn_count_unit);

CREATE INDEX ON apflora.ekzaehleinheit USING btree(sort);

COMMENT ON COLUMN apflora.ekzaehleinheit.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ekzaehleinheit.ap_id IS 'Zugehörige Art. Fremdschlüssel aus der Tabelle "ap"';

COMMENT ON COLUMN apflora.ekzaehleinheit.zaehleinheit_id IS 'Zugehörige Zähleinheit. Fremdschlüssel aus der Tabelle "tpopkontrzaehl_einheit_werte"';

COMMENT ON COLUMN apflora.ekzaehleinheit.bemerkungen IS 'Bemerkungen zur EK-Zähleinheit';

COMMENT ON COLUMN apflora.ekzaehleinheit.zielrelevant IS 'Ob die Zähleinheit zielrelevant ist';

COMMENT ON COLUMN apflora.ekzaehleinheit.not_massn_count_unit IS 'Deklariert, dass bewusst keine der zwei Zähleinheiten von Massnahmen gewählt wurde. Ermöglicht, dass eine Qualitätskontrolle auflistet, wo unbewusst Zieleinheiten gewählt wurden, welche keiner der zwei Zähleinheiten von Massnahmen entsprechen';

COMMENT ON COLUMN apflora.ekzaehleinheit.sort IS 'Um die Zähleinheiten untereinander zu sortieren';

COMMENT ON COLUMN apflora.ekzaehleinheit.changed_by IS 'Wer hat den Datensatz zuletzt geändert?';

-- ek_type
DROP TYPE IF EXISTS ek_type;

CREATE TYPE ek_type AS enum(
  'ek',
  'ekf'
);

DROP TYPE IF EXISTS ek_kontrolljahre_ab;

CREATE TYPE ek_kontrolljahre_ab AS enum(
  'ek',
  'ansiedlung'
);

-- ekplan
DROP TABLE IF EXISTS apflora.ekplan;

CREATE TABLE apflora.ekplan(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tpop_id uuid DEFAULT NULL REFERENCES apflora.tpop(id) ON DELETE CASCADE ON UPDATE CASCADE,
  jahr smallint DEFAULT NULL,
  type ek_type DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.ekplan USING btree(id);

CREATE INDEX ON apflora.ekplan USING btree(tpop_id);

CREATE INDEX ON apflora.ekplan USING btree(jahr);

CREATE INDEX ON apflora.ekplan USING btree(type);

COMMENT ON COLUMN apflora.ekplan.id IS 'Primärschlüssel';

COMMENT ON COLUMN apflora.ekplan.tpop_id IS 'Fremdschlüssel aus der Tabelle tpop';

COMMENT ON COLUMN apflora.ekplan.jahr IS 'Jahr, in dem eine EK geplant ist';

COMMENT ON COLUMN apflora.ekplan.type IS 'ek oder ekf';

COMMENT ON COLUMN apflora.ekplan.changed_by IS 'Von wem wurde der Datensatz zuletzt geändert?';

DROP TABLE IF EXISTS apflora.qk;

CREATE TABLE apflora.qk(
  name text PRIMARY KEY,
  titel text,
  beschreibung text,
  sort smallint DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON apflora.qk USING btree(name);

CREATE INDEX ON apflora.qk USING btree(titel);

CREATE INDEX ON apflora.qk USING btree(sort);

COMMENT ON COLUMN apflora.qk.name IS 'Primärschlüssel. Wird auch in Abfragen und createMessageFunctions benutzt';

DROP TABLE IF EXISTS apflora.apqk;

CREATE TABLE apflora.apqk(
  ap_id uuid NOT NULL REFERENCES apflora.ap(id) ON DELETE CASCADE ON UPDATE CASCADE,
  qk_name text NOT NULL REFERENCES apflora.qk(name) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (ap_id, qk_name)
);

CREATE INDEX ON apflora.apqk USING btree(ap_id);

CREATE INDEX ON apflora.apqk USING btree(qk_name);

DROP TABLE IF EXISTS apflora.detailplaene;

CREATE TABLE IF NOT EXISTS apflora.detailplaene(
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  data jsonb DEFAULT NULL,
  geom geometry(MultiPolygon, 4326) DEFAULT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  changed_by varchar(20) DEFAULT NULL
);

CREATE INDEX ON apflora.detailplaene USING btree(id);

CREATE INDEX ON apflora.detailplaene USING btree(geom);

-- apflora.detailplaene was received from topos
COMMENT ON TABLE apflora.detailplaene IS 'Detailpläne, die im Rahmen von apflora gesetzt wurden. Quelle: Topos';

--truncate apflora.apqk
--insert into apflora.apqk(ap_id, qk_name)
--select distinct apflora.ap.id, apflora.qk.name from apflora.ap, apflora.qk where apflora.ap.bearbeitung is null
DROP TABLE IF EXISTS apflora.ns_betreuung;

CREATE TABLE apflora.ns_betreuung(
  gebiet_nr integer PRIMARY KEY,
  gebiet_name text,
  firma text,
  projektleiter text,
  telefon text,
  geom geometry(MultiPolygon, 4326) DEFAULT NULL
);

CREATE INDEX ON apflora.ns_betreuung USING btree(geom);

CREATE INDEX ON apflora.ns_betreuung USING btree(gebiet_nr);

COMMENT ON TABLE apflora.ns_betreuung IS 'Von der FNS. Um zu das wfs betreuungsgebiete mit den Betreuern zu verknüpfen';

-- Table: apflora.ch_administrative_unit
-- source: https://opendata.swiss/en/dataset/administrative-units-switzerland-inspire
-- import according to: https://gis.stackexchange.com/a/194722/13491
-- DROP TABLE IF EXISTS apflora.ch_administrative_unit;
-- TODO: this did not work in dbdiagram.io
-- CREATE TABLE IF NOT EXISTS apflora.ch_administrative_unit(
--   id integer NOT NULL,
--   geom geometry(MultiPolygon, 4326),
--   gml_id character varying COLLATE pg_catalog."default",
--   nationalcode character varying(2) COLLATE pg_catalog."default",
--   localid character varying(32) COLLATE pg_catalog."default",
--   namespace character varying(57) COLLATE pg_catalog."default",
--   versionid character varying(3) COLLATE pg_catalog."default",
--   localisedcharacterstring character varying(8) COLLATE pg_catalog."default",
--   country character varying(2) COLLATE pg_catalog."default",
--   language character
--   varying COLLATE pg_catalog."default",
--   nativeness character varying COLLATE pg_catalog."default",
--   sourceofname character varying COLLATE pg_catalog."default",
--   pronunciation character varying COLLATE pg_catalog."default",
--   text character varying(31) COLLATE pg_catalog."default",
--   script character varying COLLATE pg_catalog."default",
--   residenceofauthority character varying COLLATE pg_catalog."default",
--   beginlifespanversion character varying(20) COLLATE pg_catalog."default",
--   boundary character varying COLLATE pg_catalog."default",
--   CONSTRAINT ch_administrative_unit_pkey PRIMARY KEY (id)
-- );

-- ALTER TABLE IF EXISTS apflora.ch_administrative_unit OWNER TO postgres;

-- GRANT SELECT ON TABLE apflora.ch_administrative_unit TO apflora_ap_reader;

-- GRANT ALL ON TABLE apflora.ch_administrative_unit TO apflora_ap_writer;

-- GRANT ALL ON TABLE apflora.ch_administrative_unit TO apflora_manager;

-- GRANT SELECT ON TABLE apflora.ch_administrative_unit TO apflora_reader;

-- GRANT ALL ON TABLE apflora.ch_administrative_unit TO postgres;

-- CREATE INDEX IF NOT EXISTS sidx_ch_administrative_unit_geom ON apflora.ch_administrative_unit USING btree(geom);

-- -- added this myself:
-- CREATE INDEX ON apflora.ch_administrative_unit USING btree(id);

-- CREATE INDEX ON apflora.ch_administrative_unit USING btree(localisedcharacterstring);

-- CREATE INDEX ON apflora.ch_administrative_unit USING btree(text);

-- CREATE INDEX ON apflora.ch_administrative_unit USING btree(geom);

