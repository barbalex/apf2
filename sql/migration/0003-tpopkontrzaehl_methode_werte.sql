ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "BeurteilCode" TO code;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "BeurteilTxt" TO text;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "BeurteilOrd" TO sort;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontrzaehl_methode_werte RENAME "MutWer" TO changed_by;