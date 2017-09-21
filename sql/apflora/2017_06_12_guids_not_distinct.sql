-- guids are not distinct!!!!

-- AP: 0 rows:
select "ApGuid", count(*), array_agg("ApArtId") AS apart_ids from apflora.ap
group by "ApGuid"
having count(*) > 1

ALTER TABLE apflora.ap
  RENAME COLUMN "ApGuid" to "ApGuid_alt";

ALTER TABLE apflora.ap
  ADD COLUMN "ApGuid" UUID Default uuid_generate_v1mc();
CREATE UNIQUE INDEX ON apflora.ap USING btree ("ApGuid");

-- pop: 2 rows:
select "PopGuid", count(*), array_agg("PopId") AS pop_ids from apflora.pop
group by "PopGuid"
having count(*) > 1

ALTER TABLE apflora.pop
  RENAME COLUMN "PopGuid" to "PopGuid_alt";

ALTER TABLE apflora.pop
  ADD COLUMN "PopGuid" UUID Default uuid_generate_v1mc();
CREATE UNIQUE INDEX ON apflora.pop USING btree ("PopGuid");

-- tpop: 0 rows:
select "TPopGuid", count(*), array_agg("TPopId") AS tpop_ids from apflora.tpop
group by "TPopGuid"
having count(*) > 1

ALTER TABLE apflora.tpop
  RENAME COLUMN "TPopGuid" to "TPopGuid_alt";

ALTER TABLE apflora.tpop
  ADD COLUMN "TPopGuid" UUID Default uuid_generate_v1mc();
CREATE UNIQUE INDEX ON apflora.tpop USING btree ("TPopGuid");

-- tpopkontr: 83 rows:
select "ZeitGuid", count(*), array_agg("TPopKontrId") AS tpopkontr_ids from apflora.tpopkontr
group by "ZeitGuid"
having count(*) > 1

ALTER TABLE apflora.tpopkontr
  RENAME COLUMN "ZeitGuid" to "ZeitGuid_alt";

ALTER TABLE apflora.tpopkontr
  ADD COLUMN "ZeitGuid" UUID Default uuid_generate_v1mc();
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree ("ZeitGuid");

-- tpopkontr: 8 rows:
select "TPopKontrGuid", count(*), array_agg("TPopKontrId") AS tpopkontr_ids from apflora.tpopkontr
group by "TPopKontrGuid"
having count(*) > 1

ALTER TABLE apflora.tpopkontr
  RENAME COLUMN "TPopKontrGuid" to "TPopKontrGuid_alt";

ALTER TABLE apflora.tpopkontr
  ADD COLUMN "TPopKontrGuid" UUID Default uuid_generate_v1mc();
CREATE UNIQUE INDEX ON apflora.tpopkontr USING btree ("TPopKontrGuid");

-- 0 rows:
select "TPopMassnGuid", count(*), array_agg("TPopMassnId") AS tpopmassn_ids from apflora.tpopmassn
group by "TPopMassnGuid"
having count(*) > 1

ALTER TABLE apflora.tpopmassn
  RENAME COLUMN "TPopMassnGuid" to "TPopMassnGuid_alt";

ALTER TABLE apflora.tpopmassn
  ADD COLUMN "TPopMassnGuid" UUID Default uuid_generate_v1mc();
CREATE UNIQUE INDEX ON apflora.tpopmassn USING btree ("TPopMassnGuid");
