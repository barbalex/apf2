ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnTypCode" TO code;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnTypTxt" TO text;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnTypOrd" TO sort;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MassnAnsiedlung" TO ansiedlung;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MutWann" TO changed;
ALTER TABLE apflora.tpopmassn_typ_werte RENAME "MutWer" TO changed_by;