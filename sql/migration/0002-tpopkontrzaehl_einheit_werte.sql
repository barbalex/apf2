ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "ZaehleinheitCode" TO code;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "ZaehleinheitTxt" TO text;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "ZaehleinheitOrd" TO sort;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopkontrzaehl_einheit_werte RENAME "MutWer" TO changed_by;