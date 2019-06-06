-- 1. update app

-- 2. drop field
ALTER TABLE apflora.tpopkontr DROP COLUMN jungpflanzen_anzahl cascade;

-- 3. rerun all views

-- 4. restart postgraphile

-- 5. communicate
Das Feld "Anzahl Jungpflanzen" im Formular der Feld-Kontrolle wurde entfernt. Stattdessen: 1. Wird die Anzahl Jungpflanzen nur noch als Zählung erfasst (wie allen anderen Anzahlen) 2. Ist das Feld "Jungpflanzen vorhanden" auch bei Feld-Kontrollen sichtbar (bisher nur bei EKF)