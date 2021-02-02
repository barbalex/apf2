-- 1. add new fields
alter table apflora.tpop add column boden_typ text DEFAULT NULL;
alter table apflora.tpop add column boden_kalkgehalt varchar(100) DEFAULT NULL;
alter table apflora.tpop add column boden_durchlaessigkeit varchar(100) DEFAULT NULL;
alter table apflora.tpop add column boden_humus varchar(100) DEFAULT NULL;
alter table apflora.tpop add column boden_naehrstoffgehalt varchar(100) DEFAULT NULL;
alter table apflora.tpop add column boden_abtrag text DEFAULT NULL;
alter table apflora.tpop add column wasserhaushalt text DEFAULT NULL;
COMMENT ON COLUMN apflora.tpop.boden_typ IS 'Bodentyp';
COMMENT ON COLUMN apflora.tpop.boden_kalkgehalt IS 'Kalkgehalt des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_durchlaessigkeit IS 'Durchlässigkeit des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_humus IS 'Humusgehalt des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_naehrstoffgehalt IS 'Nährstoffgehalt des Bodens';
COMMENT ON COLUMN apflora.tpop.boden_abtrag IS 'Oberbodenabtrag';
COMMENT ON COLUMN apflora.tpop.wasserhaushalt IS 'Wasserhaushalt';




















-- drop old fields
alter table apflora.tpopkontr drop boden_typ;
alter table apflora.tpopkontr drop boden_kalkgehalt;
alter table apflora.tpopkontr drop boden_durchlaessigkeit;
alter table apflora.tpopkontr drop boden_humus;
alter table apflora.tpopkontr drop boden_naehrstoffgehalt;
alter table apflora.tpopkontr drop boden_abtrag;
alter table apflora.tpopkontr drop wasserhaushalt;