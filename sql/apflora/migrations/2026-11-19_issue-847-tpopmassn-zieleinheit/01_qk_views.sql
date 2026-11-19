-- Issue 847: Die drei Anpflanzungs-QKs filterten hart auf typ = 2.
-- Anpflanzungen sind aber Typen mit tpopmassn_typ_werte.anpflanzung = TRUE
-- (2: Anpflanzung, 3: historisch: Ansaat und Auspflanzung) — analog
-- q_top_mit_aktuellen_anpflanzungen_ohne_zielrelevante_einheit.
-- Typ-3-Massnahmen wurden von den QKs bisher nicht geprüft.

DROP VIEW IF EXISTS apflora.v_q_anpflanzung_ohne_zielrelevante_einheit CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_ohne_zielrelevante_einheit AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  massn.id,
  massn.jahr
FROM
  apflora.tpopmassn massn
  INNER JOIN apflora.tpopmassn_typ_werte massn_typ ON massn_typ.code = massn.typ
  INNER JOIN apflora.tpop tpop
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON massn.tpop_id = tpop.id
WHERE
  massn_typ.anpflanzung = TRUE
  AND massn.zieleinheit_einheit IS NULL
ORDER BY
  pop.nr,
  tpop.nr,
  massn.jahr;

DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_einheit_falsch CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_einheit_falsch AS
SELECT
  ap.proj_id,
  ap.id AS ap_id,
  pop.id AS pop_id,
  pop.nr AS pop_nr,
  tpop.id AS tpop_id,
  tpop.nr AS tpop_nr,
  massn.id,
  massn.jahr,
  zaehl_einheit_werte.text AS ek_zieleinheit,
  massn_einheit_werte.text AS massn_zieleinheit
FROM
  apflora.tpopmassn massn
  INNER JOIN apflora.tpopmassn_typ_werte massn_typ ON massn_typ.code = massn.typ
  INNER JOIN apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte ON massn_einheit_werte.code = massn.zieleinheit_einheit
  INNER JOIN apflora.tpop tpop
  INNER JOIN apflora.pop pop
  INNER JOIN apflora.ap ap
  INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
  INNER JOIN apflora.ekzaehleinheit AS ekzaehleinheit
  INNER JOIN apflora.tpopkontrzaehl_einheit_werte AS zaehl_einheit_werte ON zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id ON ekzaehleinheit.ap_id = ap.id
    AND ekzaehleinheit.zielrelevant = TRUE ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON massn.tpop_id = tpop.id
WHERE
  massn_typ.anpflanzung = TRUE
  AND massn.zieleinheit_einheit <> zaehl_einheit_werte.code
  AND ekzaehleinheit.not_massn_count_unit IS FALSE
ORDER BY
  tax.artname,
  pop.nr,
  tpop.nr,
  massn.jahr;

DROP VIEW IF EXISTS apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch CASCADE;

CREATE OR REPLACE VIEW apflora.v_q_anpflanzung_zielrelevante_anzahl_falsch AS
with data AS (
  SELECT
    ap.proj_id,
    ap.id AS ap_id,
    pop.id AS pop_id,
    pop.nr AS pop_nr,
    tpop.id AS tpop_id,
    tpop.nr AS tpop_nr,
    massn.id,
    massn.jahr,
    zaehl_einheit_werte.text AS ek_zieleinheit,
    massn.zieleinheit_anzahl AS zieleinheit_anzahl,
    CASE WHEN zaehl_einheit_werte.corresponds_to_massn_anz_triebe = TRUE THEN
      massn.anz_triebe
    WHEN zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = TRUE THEN
      massn.anz_pflanzen
    END AS anzahl
  FROM
    apflora.tpopmassn massn
    INNER JOIN apflora.tpopmassn_typ_werte massn_typ ON massn_typ.code = massn.typ
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte massn_einheit_werte ON massn_einheit_werte.code = massn.zieleinheit_einheit
    INNER JOIN apflora.tpop tpop
    INNER JOIN apflora.pop pop
    INNER JOIN apflora.ap ap
    INNER JOIN apflora.ae_taxonomies tax ON tax.id = ap.art_id
    INNER JOIN apflora.ekzaehleinheit AS ekzaehleinheit
    INNER JOIN apflora.tpopkontrzaehl_einheit_werte AS zaehl_einheit_werte ON zaehl_einheit_werte.id = ekzaehleinheit.zaehleinheit_id ON ekzaehleinheit.ap_id = ap.id
      AND ekzaehleinheit.zielrelevant = TRUE ON ap.id = pop.ap_id ON pop.id = tpop.pop_id ON massn.tpop_id = tpop.id
  WHERE
    massn_typ.anpflanzung = TRUE
    AND massn.zieleinheit_einheit IS NOT NULL
    AND ekzaehleinheit.not_massn_count_unit IS FALSE
    AND zaehl_einheit_werte.text = massn_einheit_werte.text
    AND ((zaehl_einheit_werte.corresponds_to_massn_anz_triebe = TRUE
        AND massn.anz_triebe IS NOT NULL)
      OR (zaehl_einheit_werte.corresponds_to_massn_anz_pflanzen = TRUE
        AND massn.anz_pflanzen IS NOT NULL)))
SELECT
  *
FROM
  data
WHERE
  zieleinheit_anzahl <> anzahl
  OR (zieleinheit_anzahl IS NULL
    AND anzahl IS NOT NULL)
  OR (zieleinheit_anzahl IS NOT NULL
    AND anzahl IS NULL)
ORDER BY
  pop_nr,
  tpop_nr,
  jahr;
