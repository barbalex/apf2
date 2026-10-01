-- Anpflanzungen (Typen 2 und 3) mit zieleinheit_anzahl, aber ohne zieleinheit_einheit
-- Die zielrelevante Einheit wird nachgetragen, wo sie eindeutig hervorgeht:
-- - die Einheit des AP hat den Korrespondenz-Flag für anz_triebe oder anz_pflanzen
-- - zieleinheit_anzahl entspricht exakt diesem Wert
-- Grund: Ohne zieleinheit_einheit gelten Anpflanzungen nicht als ziel-relevant
-- und werden in den Auswertungen nicht berücksichtigt
-- (apflora.ap_ausw_pop_menge, apflora.pop_ausw_tpop_menge; Issue 794, Regel 5)
-- Vorher kontrolliert am 1.10.2026: 41 betroffene Massnahmen, davon 39 eindeutig befüllbar.
-- Bewusst nicht befüllt (manuell zu prüfen):
-- - Carex hartmanii, Pop 17, TPop 18, 2019: Zieleinheit "Deckung x Fläche" (102), anzahl 50 entspricht Pflanzen
-- - Rosa gallica, Pop 113, TPop 1, 2021: Zieleinheit "davon blühende Triebe" (11), zieleinheit_anzahl = 0

-- Kontrolle vorher
SELECT
  tax.artname,
  p.nr AS pop_nr,
  t.nr AS tpop_nr,
  m.jahr,
  m.anz_triebe,
  m.anz_pflanzen,
  m.zieleinheit_anzahl
FROM apflora.tpopmassn m
INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = m.typ AND tw.anpflanzung = TRUE
INNER JOIN apflora.tpop t ON t.id = m.tpop_id
INNER JOIN apflora.pop p ON p.id = t.pop_id
INNER JOIN apflora.ap a ON a.id = p.ap_id
INNER JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
WHERE
  m.zieleinheit_anzahl IS NOT NULL
  AND m.zieleinheit_einheit IS NULL
ORDER BY
  tax.artname,
  p.nr,
  t.nr,
  m.jahr;

UPDATE apflora.tpopmassn m
SET
  zieleinheit_einheit = ze.code,
  changed_by = 'ag'
FROM apflora.tpopmassn_typ_werte tw,
  apflora.tpop t,
  apflora.pop p,
  apflora.ap a,
  apflora.ekzaehleinheit e,
  apflora.tpopkontrzaehl_einheit_werte ze
WHERE
  tw.code = m.typ
  AND tw.anpflanzung = TRUE
  AND t.id = m.tpop_id
  AND p.id = t.pop_id
  AND a.id = p.ap_id
  AND e.ap_id = a.id
  AND e.zielrelevant = TRUE
  AND ze.id = e.zaehleinheit_id
  AND m.zieleinheit_anzahl IS NOT NULL
  AND m.zieleinheit_einheit IS NULL
  AND (
    (ze.corresponds_to_massn_anz_triebe = TRUE AND m.zieleinheit_anzahl = m.anz_triebe)
    OR (ze.corresponds_to_massn_anz_pflanzen = TRUE AND m.zieleinheit_anzahl = m.anz_pflanzen)
  );

-- Kontrolle nachher: erwartet werden nur noch die 2 manuell zu prüfenden Fälle
SELECT
  tax.artname,
  p.nr AS pop_nr,
  t.nr AS tpop_nr,
  m.jahr,
  m.zieleinheit_anzahl,
  ze.text AS zielrelevant_text
FROM apflora.tpopmassn m
INNER JOIN apflora.tpopmassn_typ_werte tw ON tw.code = m.typ AND tw.anpflanzung = TRUE
INNER JOIN apflora.tpop t ON t.id = m.tpop_id
INNER JOIN apflora.pop p ON p.id = t.pop_id
INNER JOIN apflora.ap a ON a.id = p.ap_id
INNER JOIN apflora.ae_taxonomies tax ON tax.id = a.art_id
INNER JOIN apflora.ekzaehleinheit e ON e.ap_id = a.id AND e.zielrelevant = TRUE
INNER JOIN apflora.tpopkontrzaehl_einheit_werte ze ON ze.id = e.zaehleinheit_id
WHERE
  m.zieleinheit_anzahl IS NOT NULL
  AND m.zieleinheit_einheit IS NULL
ORDER BY
  tax.artname,
  p.nr,
  t.nr,
  m.jahr;
