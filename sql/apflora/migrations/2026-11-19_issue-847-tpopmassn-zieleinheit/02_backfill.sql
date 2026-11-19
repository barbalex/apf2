-- Issue 847: Fehlende Ziel-Einheiten von Anpflanzungen ergänzen, wo sie eindeutig
-- hervorgehen — gleiches Muster wie 2020-03-22_tpopmassn_zielrelevant_setzen.sql,
-- 2021-01-31_appflanzung_ohne_zielrelevant_ergaenzen.sql und
-- 2026-10-01_anpflanzung_zieleinheit_einheit_ergaenzen.sql:
-- - Typ ist Anpflanzung (Typen 2 und 3)
-- - die Art hat eine zielrelevante Zähleinheit (max. eine, Unique-Index)
--   mit not_massn_count_unit = FALSE
-- - zieleinheit_einheit fehlt ODER entspricht bereits der zielrelevanten
--   Zähleinheit, und zieleinheit_anzahl fehlt
-- - die Zähleinheit hat einen Korrespondenz-Flag und der entsprechende
--   Wert (anz_triebe/anz_pflanzen) ist erfasst
-- Bewusst nicht angetastet:
-- - nicht-leere, abweichende zieleinheit_anzahl (listet die QK
--   anpflanzungZielrelevanteAnzahlFalsch weiterhin auf)
-- - zieleinheit_anzahl ohne passenden Korrespondenz-Wert
-- - Einheiten von Arten ohne zielrelevante Zähleinheit oder mit
--   not_massn_count_unit = TRUE

-- Kontrolle vorher (am 19.11.2026: 107 Datensätze, 63 mit fehlender Einheit,
-- 44 mit vorhandener Einheit aber fehlender Anzahl)
SELECT
  tax.artname,
  p.nr AS pop_nr,
  t.nr AS tpop_nr,
  m.jahr,
  m.typ,
  m.anz_triebe,
  m.anz_pflanzen,
  m.zieleinheit_einheit,
  m.zieleinheit_anzahl,
  w.code AS zielrelevante_einheit_code,
  w.text AS zielrelevante_einheit_text
FROM apflora.tpopmassn m
INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = m.typ
INNER JOIN apflora.tpop t ON t.id = m.tpop_id
INNER JOIN apflora.pop p ON p.id = t.pop_id
INNER JOIN apflora.ap a ON a.id = p.ap_id
INNER JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
INNER JOIN apflora.ekzaehleinheit e ON e.ap_id = a.id AND e.zielrelevant = TRUE
INNER JOIN apflora.tpopkontrzaehl_einheit_werte w ON w.id = e.zaehleinheit_id
WHERE
  tw.anpflanzung = TRUE
  AND COALESCE(e.not_massn_count_unit, FALSE) = FALSE
  AND (m.zieleinheit_einheit IS NULL OR m.zieleinheit_einheit = w.code)
  AND m.zieleinheit_anzahl IS NULL
  AND (
    (w.corresponds_to_massn_anz_triebe = TRUE AND m.anz_triebe IS NOT NULL)
    OR (w.corresponds_to_massn_anz_pflanzen = TRUE AND m.anz_pflanzen IS NOT NULL)
  )
ORDER BY
  tax.artname,
  p.nr,
  t.nr,
  m.jahr;

UPDATE apflora.tpopmassn m
SET
  zieleinheit_einheit = w.code,
  zieleinheit_anzahl = CASE
    WHEN w.corresponds_to_massn_anz_triebe = TRUE THEN m.anz_triebe
    ELSE m.anz_pflanzen
  END,
  changed_by = 'ag'
FROM apflora.tpopmassn_typ_werte tw,
  apflora.tpop t,
  apflora.pop p,
  apflora.ap a,
  apflora.ekzaehleinheit e,
  apflora.tpopkontrzaehl_einheit_werte w
WHERE
  tw.code = m.typ
  AND tw.anpflanzung = TRUE
  AND t.id = m.tpop_id
  AND p.id = t.pop_id
  AND a.id = p.ap_id
  AND e.ap_id = a.id
  AND e.zielrelevant = TRUE
  AND w.id = e.zaehleinheit_id
  AND COALESCE(e.not_massn_count_unit, FALSE) = FALSE
  AND (m.zieleinheit_einheit IS NULL OR m.zieleinheit_einheit = w.code)
  AND m.zieleinheit_anzahl IS NULL
  AND (
    (w.corresponds_to_massn_anz_triebe = TRUE AND m.anz_triebe IS NOT NULL)
    OR (w.corresponds_to_massn_anz_pflanzen = TRUE AND m.anz_pflanzen IS NOT NULL)
  );

-- Kontrolle nachher: erwartet 0 Datensätze
SELECT
  tax.artname,
  p.nr AS pop_nr,
  t.nr AS tpop_nr,
  m.jahr,
  m.anz_triebe,
  m.anz_pflanzen,
  m.zieleinheit_einheit,
  m.zieleinheit_anzahl
FROM apflora.tpopmassn m
INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = m.typ
INNER JOIN apflora.tpop t ON t.id = m.tpop_id
INNER JOIN apflora.pop p ON p.id = t.pop_id
INNER JOIN apflora.ap a ON a.id = p.ap_id
INNER JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
INNER JOIN apflora.ekzaehleinheit e ON e.ap_id = a.id AND e.zielrelevant = TRUE
INNER JOIN apflora.tpopkontrzaehl_einheit_werte w ON w.id = e.zaehleinheit_id
WHERE
  tw.anpflanzung = TRUE
  AND COALESCE(e.not_massn_count_unit, FALSE) = FALSE
  AND (m.zieleinheit_einheit IS NULL OR m.zieleinheit_einheit = w.code)
  AND m.zieleinheit_anzahl IS NULL
  AND (
    (w.corresponds_to_massn_anz_triebe = TRUE AND m.anz_triebe IS NOT NULL)
    OR (w.corresponds_to_massn_anz_pflanzen = TRUE AND m.anz_pflanzen IS NOT NULL)
  )
ORDER BY
  tax.artname,
  p.nr,
  t.nr,
  m.jahr;
