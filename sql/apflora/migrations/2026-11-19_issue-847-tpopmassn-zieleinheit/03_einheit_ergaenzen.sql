-- Issue 847, Teil 2: auch die Ziel-Einheit selbst nachtragen.
-- Der Trigger setzt zieleinheit_einheit bei jeder Anpflanzung, deren Art
-- eine zielrelevante Zähleinheit hat — unabhängig davon, ob Anzahl Triebe
-- oder Anzahl Pflanzen erfasst sind. Historische Zeilen ohne Einheit
-- hinken dem nach. Gefüllt wird:
-- - Typ ist Anpflanzung (Typen 2 und 3)
-- - die Art hat eine zielrelevante Zähleinheit (max. eine, Unique-Index)
-- - Einheit UND Anzahl sind beide leer (reine «nie erfasst»-Zeilen)
-- Bewusst nicht angetastet:
-- - Zeilen mit Anzahl aber ohne Einheit: mehrdeutig, wurden am 1.10.2026
--   manuell geprüft (2026-10-01_anpflanzung_zieleinheit_einheit_ergaenzen.sql)
-- - Anpflanzungen von Arten ohne zielrelevante Zähleinheit: Art-Konfiguration
--   fehlt; listet die QK ap_mit_aktuellen_kontrollen_ohne_zielrelevante_einheit
--   auf (lokal: 1254 Zeilen)
-- - nicht ableitbare Anzahlen (kein passender Korrespondenz-Wert erfasst):
--   listet die QK anpflanzung_zielrelevante_anzahl_falsch bzw. manuell zu erfassen
-- Die Auswertungen (ap_ausw_pop_menge, pop_ausw_tpop_menge) zählen nur
-- Zeilen mit Einheit UND Anzahl — dieses Nachtragen allein ändert sie nicht.

-- Kontrolle vorher (am 19.11.2026 lokal: 1138 Datensätze)
SELECT
  tax.artname,
  p.nr AS pop_nr,
  t.nr AS tpop_nr,
  m.jahr,
  m.anz_triebe,
  m.anz_pflanzen,
  w.text AS zielrelevante_einheit
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
  AND m.zieleinheit_einheit IS NULL
  AND m.zieleinheit_anzahl IS NULL
ORDER BY
  tax.artname,
  p.nr,
  t.nr,
  m.jahr;

UPDATE apflora.tpopmassn m
SET
  zieleinheit_einheit = w.code,
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
  AND m.zieleinheit_einheit IS NULL
  AND m.zieleinheit_anzahl IS NULL;

-- Kontrolle nachher: erwartet 0 Datensätze
SELECT
  tax.artname,
  p.nr AS pop_nr,
  t.nr AS tpop_nr,
  m.jahr
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
  AND m.zieleinheit_einheit IS NULL
  AND m.zieleinheit_anzahl IS NULL
ORDER BY
  tax.artname,
  p.nr,
  t.nr,
  m.jahr;
