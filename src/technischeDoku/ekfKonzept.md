---
typ: 'technDoku'
path: '/Dokumentation/Technisch/EK-Konzept'
date: '2019-06-21'
title: 'EK-Konzept'
sort: 11
---

Erfolgskontrollen sind gleichzeitig wichtig und aufwändig.
- Ihre Durchführung soll daher sorgfältig geplant werden
- Artverantwortliche und Topos benötigen eine gute Übersicht über geplante und durchgeführte EK's
- Es ist sicher zu stellen, dass für jede Art die gewünschten Einheiten gezählt werden

Nachfolgend der Plan für die Umsetzung.<br/><br/>

#### Tabellen-Struktur
- neue Tabelle `ekzaehleinheit`. Hier wird pro Art bestimmt, welche Einheiten gezählt werden sollen. Umwandlung der bestehenden Tabelle `ekfzaehleinheit`. Mit folgenden Feldern:
  - `id`
  - `ap_id`
  - `zaehleinheit_id`
  - `zielrelevant` (neu): ja/nein. Die zielrelevanten sind die Einheiten, deren Anzahlen ausgewertet und mit den Zielen verglichen werden
  - `sort` (neu): Einheiten sollen in einer bestimmten Reihenfolge angezeigt werden
  - `bemerkungen`
- neue Tabelle `ekfrequenz`, nur von managern bearbeitbar. Felder:
  - `ap_id`: Frequenzen werden pro Aktionsplan definiert. Anfänglich werden dieselben Frequenzen in alle Aktionspläne importiert.
  - `id`
  - `ek`: ja/nein. Diese Frequenz ist für EK anwendbar
  - `ekf`: ja/nein. Diese Frequenz ist für EKF anwendbar
  - `anwendungsfall`: Text. Beschreibt, in welchen Fällen diese Frequenz angewandt wird. Wahrscheinliche Werte:
    - `autochthone Population`
    - `angepflanzte Population`
    - `angesäte Population`
    - `Spezialfall`
  - `kuerzel`: Wird für den Import verwendet
  - `name`
  - `periodizitaet`. Beispielswerte:
    - `jedes 2. Jahr`
    - `nie`
  - `kontrolljahre`. Z.B.: `[2, 4, 6, 8, 10]`. Definiert, in welchen Jahren eine Kontrolle üblicherweise stattfinden soll. Bei Anpflanzungen sind das Jahre ab der letzten Anpflanzung. Bei autochthonen Populationen?
  - `anzahl_min`: Ab dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant.
  - `anzahl_max`: Bis zu dieser Anzahl Individuen wird diese Frequenz bei autochthonen Populationen (normalerweise) gewählt. Bei Anpflanzungen nicht relevant.
  - `bemerkungen`
- neue Tabelle `abrechnungstyp_werte` mit den für Wertelisten üblichen Feldern
- neue Felder auf tpop:
  - `ekfrequenz`
  - `abrechnungstyp`: Auswahl aus der Tabelle `abrechnungstyp_werte`
  - bestehende zwei kontrollfrequenz-Felder wieder entfernen
- neue Tabelle: `ekplan` mit Feldern:
  - `tpopkontr_id`
  - `jahr`
  - `typ`: `ek` oder `ekf`

#### Strukturbaum
- Neuer Knoten im AP: `EK-Frequenz-Typen`. Mit Formular, um die Daten zu erfassen.
- Neuer Knoten in den Werte-Listen: `EK: Abrechnungs-Typen`
- Bestehender Knoten `EKF-Zähleinheiten` wird neu `EK-Zähleinheiten`

#### Formular TPop
- Neue Felder der Tabelle tpop ergänzen
- Liste aller Kontrolljahre anzeigen. Ist hier nicht bearbeitbar.

#### Neues Formular EK-Planung
Das Formular, um Kontrollen zu planen.
- Liste von Teil-Populationen
- Sortiert nach: AP, Pop-Nr, TPop-Nr
- Felder aus AP, Pop und Tpop werden angezeigt (nicht bearbeitbar)
- Diese Felder können ein- und ausgeblendet werden
- Abrechnungstyp und EK-Frequenz können bearbeitet werden
- Für den Bereich zwischen 1996 und 20 Jahre in die Zukunft werden für jedes Jahr Spalten angezeigt
- Der Jahres-Spalten-Bereich kann horizontal gescrollt werden 
- Eine Jahres-Spalte zeigt folgende Informationen an:
  - EK: geplant (bearbeitbar) / durchgeführt
  - EKF geplant (bearbeitbar) / durchgeführt
  - Ansiedlungen? Unterscheiden nach Ansaat und Auspflanzung?


#### Import
- EK-Frequenzen werden einmalig für alle Arten gleich gesetzt
- EK-Pläne werden einmalig aus Excel-Liste von Topos importiert
- Danach zuhanden Topos Liste generieren: bei welchen TPop fehlen EK-Pläne

#### Exporte
- Für EK und EKF vorsehen. Später spezifizieren.
- EKF-Export, um zu vergleichen geplant <> kontrolliert

#### QK: 
- Erloschene TPop sollten keine Kontrollen geplant haben
- Bei welchen TPop fehlen EK-Pläne
- TPop mit Kontrollen im Jahr. Aber mindestens eine der zielrelevanten Einheiten wurde nicht erfasst

Termin: Sollte möglichst bald nach den Sommerferien bereit sein.
