ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "ZaehleinheitCode" TO code;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "ZaehleinheitTxt" TO text;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "ZaehleinheitOrd" TO sort;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "MutWer" TO changed_by;

-- done: rename in sql
-- done: add all views, functions, triggers with tpopkontrzaehl_einheit_werte to next file
-- done: make sure createTable is correct
-- done: rename in js
-- done: test app
-- done: update js and run this file on server