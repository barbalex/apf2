---
typ: 'technDoku'
path: '/Dokumentation/Technisch/EK-Weiterentwicklung-2019'
date: '2019-06-21'
title: 'EK-Weiterentwicklung 2019'
sort: 11
---

Erfolgskontrollen sind gleichzeitig wichtig und aufwändig. Sie beginnen mit der Zielsetzung und enden mit der Berichterstattung. Im Jahr 2019 ist geplant, die Verwaltung und Planung der eigentlichen Kontrollen in apflora weiter zu entwickeln:
- Ihre Durchführung soll sorgfältig geplant werden können
- Topos und Artverantwortliche sollen eine gute Übersicht über geplante und durchgeführte EK's erhalten
- Es ist sicher zu stellen, dass für jede Art die zielrelevanten Einheiten gezählt und dokumentiert werden

Das soll mit folgenden Massnahmen umgesetzt werden:<br/><br/>

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
  - `ekfrequenz_abweichend`: Diese Frequenz entspricht nicht derjenigen, welche gemäss Populationsgrösse vergeben worden wäre
  - `ek_abrechnungstyp`: Auswahl aus der Tabelle `abrechnungstyp_werte`
  - bestehende zwei kontrollfrequenz-Felder wieder entfernen
- neue Felder auf tpopkontr:
  - `apber_nicht_relevant`: Wenn "ja" soll diese Kontrolle für den Jahresbericht nicht berücksichtigt werden (ist umgesetzt)
  - `apber_nicht_relevant_grund`: Begründen, wieso nicht berücksichtigt (ist umgesetzt)
- neue Tabelle: `ekplan` mit Feldern:
  - `tpopkontr_id`
  - `jahr`
  - `typ`: `ek` oder `ekf`

#### Strukturbaum
- Neuer Knoten im AP: `EK-Frequenz-Typen`. Mit Formular, um die Daten zu erfassen.
- Neuer Knoten in den Werte-Listen: `EK: Abrechnungs-Typen`
- Bestehender Knoten `EKF-Zähleinheiten` wird neu `EK-Zähleinheiten`

#### Formular TPop
- Neue Felder der Tabelle tpop ergänzen (bearbeitbar)
- Liste aller Kontrolljahre anzeigen. Ist hier nicht bearbeitbar.

#### Neues Formular EK-Planung
Das Formular, um Kontrollen zu planen.
- Es besteht aus einer Liste von Teil-Populationen...
- ...aus einem oder mehreren Aktionsplänen (Benutzer wählt)
- Sortiert nach: AP, Pop-Nr, TPop-Nr
- Ein Symbol, um die Teil-Population in einem neuen Fenster zu öffnen
- Felder aus AP, Pop und Tpop (nicht bearbeitbar). Namentlich:
  - Artname
  - Pop Nr
  - Pop Name
  - Pop Status
  - TPop Nr
  - TPop Gemeinde
  - TPop Flurname
  - TPop Status
  - TPop Bekannt seit
- Diese Felder können ein- und ausgeblendet werden
- Abrechnungstyp und EK-Frequenz können bearbeitet werden
- Für den Bereich zwischen 1996 und 20 Jahre in die Zukunft werden für jedes Jahr Spalten generiert
- Der Jahres-Spalten-Bereich kann horizontal gescrollt werden, wenn der Platz für die Anzeige aller nicht ausreicht
- Eine Jahres-Spalte zeigt folgende Informationen an:
  - EK geplant, bearbeitbar
  - EK: Summen für die zielrelevante(n) Zähleinheit(en) aus für den Jahresbericht relevanten Kontrollen
  - EKF geplant, bearbeitbar
  - EKF: Summen für die zielrelevante(n) Zähleinheit(en) aus für den Jahresbericht relevanten Kontrollen
  - Massnahmen des Typs Ansiedlung (unterscheiden nach Anpflanzung/Ansaat?)
- Der Benutzer kann wählen, welche der obigen Informationen angezeigt werden
- Fährt man mit der Maus über EK, EKF und Massnahmen, werden deren wichtigsten Angaben angezeigt. Und ein Link, um das Objekt in einem neuen Fenster zu öffnen
- "Schulden" 1: Felder in der Jahres-Spalte, bei denen eine EK/EKF geplant aber nicht durchgeführt wurde und die in der Vergangenheit liegen, werden farblich hervorgehoben
- "Schulden" 2: Später geplante Ergänzung: Wenn die geplante Kontrolle nicht im nächsten Jahr nachgeholt wurde und das nächste Jahr in der Vergangenheit ligt: besonders auffällig markieren.
- "Schulden" 3: Später geplante Ergänzung: Benutzer kann wählen, Schulden anzuzeigen oder nicht

#### Import
- EK-Frequenzen werden einmalig und für alle Arten gleich gesetzt
- EK-Pläne werden einmalig aus Excel-Liste von Topos importiert
- Danach zuhanden Topos Liste generieren: bei welchen TPop fehlen EK-Pläne

#### Exporte
- TPop zur Dokumentation der Planung zu bestimmten Zeitpunkten. Felder:
  - Aus AP, Pop und TPop wie im Formular EK-Planung
  - EK-Frequenz
  - Abrechnungstyp
  - geplanten EK
  - geplanten EKF
- Stand Zählungen pro Propulation:
  - pro zielrelevanter Einheit
  - pro TPop Wert aus letzter EK/EKF ermitteln
  - und als "Anzahl kontrolliert" pro Pop summieren
  - zusätzlich "Anzahl inkl. neu angesiedelt, noch nicht kontrolliert" rechnen. Anzahl aus der Anzahl Pflanzen oder Triebe der Massnahme entnehmen.

#### Qualitätskontrollen
- Erloschene TPop mit geplanten Kontrollen
- TPop, die gemäss `ekfrequenz` kontrolliert werden sollten, ohne EK-Pläne
- TPop mit Kontrollen im Bericht-Jahr. Mindestens eine der zielrelevanten Einheiten wurde nicht erfasst
- TPop, bei denen die ekfrequenz nicht derjenigen entspricht, welche nach der Populationsgrösse zugewiesen werden sollte und nicht als `abweichend` markiert ist
- TPop mit Abrechnungstyp D (Anpflanzung), deren Anpflanzung mehr als 4 Jahre her ist

#### Navigation
Wenn ein Projekt geöffnet ist, steht in der Menüzeile rechts vom "Strukturbaum 2" eine neue Schaltfläche zur Verfügung: "EK-Planung".<br/><br/>

Befindet man sich im Formular EK-Planung, gibt es in der Menüzeile oben rechts folgende Befehle:
- Aktionspläne bearbeiten
- Dokumentation
- Mehr

#### Termin
Sollte möglichst bald nach den Sommerferien bereit sein.
