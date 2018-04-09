ALTER TABLE apflora.tpopmassn RENAME "TPopMassnGuid" TO id;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnId" TO id_old;
ALTER TABLE apflora.tpopmassn RENAME "TPopId" TO tpop_id;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnTyp" TO typ;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnTxt" TO beschreibung;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnJahr" TO jahr;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnDatum" TO datum;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnBearb" TO bearbeiter;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnBemTxt" TO bemerkungen;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnPlan" TO plan_vorhanden;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnPlanBez" TO plan_bezeichnung;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnFlaeche" TO flaeche;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnMarkierung" TO markierung;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedAnzTriebe" TO anz_triebe;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedAnzPfl" TO anz_pflanzen;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnzPflanzstellen" TO anz_pflanzstellen;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedWirtspfl" TO wirtspflanze;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedHerkunftPop" TO herkunft_pop;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedDatSamm" TO sammeldatum;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedForm" TO form;
ALTER TABLE apflora.tpopmassn RENAME "TPopMassnAnsiedPflanzanordnung" TO pflanzanordnung;
ALTER TABLE apflora.tpopmassn RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassn RENAME "MutWer" TO changed_by;

COMMENT ON COLUMN apflora.tpopmassn.id_old IS 'frühere id';

-- change primary key
ALTER TABLE apflora.tpopmassn DROP CONSTRAINT tpopmassn_pkey;
ALTER TABLE apflora.tpopmassn ADD PRIMARY KEY (id);

-- done: rename in sql
-- TODO: check if old id was used somewhere. If so: rename that field, add new one and update that
-- TODO: add all views, functions, triggers with tpopkontrzaehl to this file
-- TODO: make sure createTable is correct
-- TODO: rename in js
-- TODO: test app
-- TODO: update js and run this file on server



-- need to remove TPopMassnGuid_alt from apflora.v_massn before dropping
ALTER TABLE apflora.tpopmassn DROP COLUMN "TPopMassnGuid_alt";

-- views: many from createViews2 (counting massn)