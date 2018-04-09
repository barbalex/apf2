ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnTypCode" TO code;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnTypTxt" TO text;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnTypOrd" TO sort;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnAnsiedlung" TO ansiedlung;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MutWer" TO changed_by;

-- done: rename in sql
-- done: add all views, functions, triggers with tpopmassn_typ_werte to next file
-- done: make sure createTable is correct
-- done: rename in js
-- done: test app
-- done: update js and run this file on server