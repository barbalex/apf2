ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "BeurteilId" TO code;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "BeurteilTxt" TO text;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "BeurteilOrd" TO sort;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassn_erfbeurt_werte RENAME "MutWer" TO changed_by;