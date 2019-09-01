---
typ: 'technDoku'
path: '/Dokumentation/Technisch/EK-Weiterentwicklung-2019'
date: '2019-09-01'
title: 'EK-Weiterentwicklung 2019'
sort: 11
---

Erfolgskontrollen sind gleichzeitig wichtig und aufwändig. Sie beginnen mit der Zielsetzung und enden mit der Berichterstattung. Im Jahr 2019 wird die Verwaltung und Planung der eigentlichen Kontrollen in apflora weiter entwickelt. Ziele:
- Kontrollen werden sorgfältig geplant
- Topos und Artverantwortliche erhalten eine gute Übersicht über geplante und durchgeführte EK's
- Es werden die für eine Art zielrelevanten Einheiten gezählt und dokumentiert

Das soll mit folgenden Massnahmen umgesetzt werden:<br/><br/>

#### Strukturbaum
- :white_check_mark: Neuer Knoten im AP: `EK-Frequenzen`. Mit Formular, um die Daten zu erfassen. Inklusive Kontrolljahren und EK-Abrechnungstyp
- :white_check_mark: Neuer Knoten in den Werte-Listen: `EK: Abrechnungs-Typen`
- :white_check_mark: Bestehender Knoten `EKF-Zähleinheiten`:
  - Heisst neu `EK-Zähleinheiten`
  - Maximal eine Zähleinheit kann als zielrelevant gewählt werden. Versucht man mehr zu wählen, wird direkt unter der Eingabe erklärt, dass das nicht möglich ist 

#### Formular TPop
- :white_check_mark: Neue Felder der Tabelle tpop ergänzen (bearbeitbar)
- :white_check_mark: Liste aller Kontrolljahre anzeigen. Ist hier nicht bearbeitbar.

#### Neues Formular EK-Planung
Das Formular, um Kontrollen zu planen.
- :white_check_mark: Es besteht aus einer Liste von Teil-Populationen...
- :white_check_mark: ...aus einem oder mehreren Aktionsplänen (Benutzer wählt)
- :white_check_mark: Sortiert nach: AP, Pop-Nr, TPop-Nr
- :white_check_mark: Ein Symbol, um die Teil-Population in einem neuen Fenster zu öffnen
- :white_check_mark: Felder aus AP, Pop und Tpop (nicht bearbeitbar). Namentlich:
  - Artname
  - Pop Nr
  - Pop Name
  - Pop Status
  - TPop Nr
  - TPop Gemeinde
  - TPop Flurname
  - TPop Status
  - TPop Bekannt seit
- :white_check_mark: Betreffend EK werden diese Felder angezeigt:
  - EK-Abrechnungstyp
  - EK-Frequenz (bearbeitbar)
  - EK-Frequenz Startjahr (bearbeitbar)
  - EK-Frequenz abweichend (bearbeitbar)
- :white_check_mark: Alle bisher erwähnten Felder können ein- und ausgeblendet werden
- :white_check_mark: Ändert man im Formular EK-Plan die Felder "EK-Frequenz" oder "EK-Frequenz Startjahr" und sind in beiden Feldern Werte erfasst, macht die Anwendung folgendes:
  - Sie löscht alle bestehenden EK-Pläne ab dem Startjahr
  - Sie liest die Kontrolljahre aus der EK-Frequenz aus
  - Sie erzeugt neue Kontrolljahre, basierend auf dem Startjahr und den Kontrolljahren
  - Sie meldet dem Benutzer dabei, was sie macht bzw. gemacht hat
- :white_check_mark: Für den Bereich zwischen der ersten Kontrolle, die ab 1993 erfolgte und 15 Jahre in die Zukunft werden für jedes Jahr Spalten generiert
- :white_check_mark: Der Jahres-Spalten-Bereich kann horizontal gescrollt werden, wenn der Platz für die Anzeige aller nicht ausreicht
- :white_check_mark: Eine Jahres-Spalte zeigt folgende Informationen an:
  - EK:
    - wieviele durchgeführt
    - Summen für die zielrelevante Zähleinheit aus für den Jahresbericht relevanten Kontrollen
  - EK geplant (bearbeitbar)
  - EKF: 
    - wieviele durchgeführt
    - Summen für die zielrelevante(n) Zähleinheit(en) aus für den Jahresbericht relevanten Kontrollen
  - EKF geplant (bearbeitbar)
  - Massnahmen des Typs Ansiedlung
  - Die Art der Darstellung macht es einfach, zu erkennen, wo Planung und Ausführung nicht übereinstimmen
- :white_check_mark: Der Benutzer kann wählen, welche der obigen Informationen angezeigt werden
- :white_check_mark: Klickt man auf eine Tabellen-Zelle, werden die wichtigsten Angaben für EK, EKF und Massnahmen angezeigt. Und ein Link, um das Objekt in einem neuen Fenster zu öffnen
- :white_check_mark: das Formular funktioniert brauchbar schnell

#### Import
- :white_medium_square: EK-Frequenzen werden einmalig und für alle Arten gleich gesetzt
- :white_medium_square: EK-Pläne werden einmalig aus Excel-Liste von Topos importiert
- :white_medium_square: Danach zuhanden Topos Liste generieren: bei welchen TPop fehlen EK-Pläne

#### Exporte
- :white_medium_square: TPop zur Dokumentation der Planung zu bestimmten Zeitpunkten. Felder:
  - Aus AP, Pop und TPop wie im Formular EK-Planung
  - EK-Frequenz
  - Abrechnungstyp
  - geplanten EK
  - geplanten EKF
- :white_medium_square: Stand Zählungen pro Propulation:
  - pro zielrelevanter Einheit
  - pro TPop Wert aus letzter EK/EKF ermitteln
  - und als "Anzahl kontrolliert" pro Pop summieren
  - zusätzlich "Anzahl inkl. neu angesiedelt, noch nicht kontrolliert" rechnen. Anzahl aus der Anzahl Pflanzen oder Triebe der Massnahme entnehmen.

#### Qualitätskontrollen
- :white_medium_square: Erloschene TPop mit geplanten Kontrollen
- :white_medium_square: TPop, die gemäss `ekfrequenz` kontrolliert werden sollten, ohne EK-Pläne
- :white_medium_square: TPop mit Kontrollen im Bericht-Jahr. Mindestens eine der zielrelevanten Einheiten wurde nicht erfasst
- :white_medium_square: TPop, bei denen die ekfrequenz nicht derjenigen entspricht, welche nach der Populationsgrösse zugewiesen werden sollte und nicht als `abweichend` markiert ist
- :white_medium_square: TPop mit Abrechnungstyp D (Anpflanzung), deren Anpflanzung mehr als 4 Jahre her ist

#### Navigation
- :white_check_mark: Wenn ein Projekt geöffnet ist, steht in der Menüzeile rechts vom "Strukturbaum 2" eine neue Schaltfläche zur Verfügung: "EK-Plan"
- :white_check_mark: Befindet man sich im Formular EK-Planung, gibt es in der Menüzeile oben rechts folgende Befehle:
  - Aktionspläne bearbeiten
  - Dokumentation
  - Mehr

#### Tabellen-Struktur
- :white_check_mark: neue Tabelle `ekzaehleinheit`. Hier wird pro Art bestimmt, welche Einheiten gezählt werden sollen. Ersetzt die bestehende Tabelle `ekfzaehleinheit`. Mit folgenden Feldern:
  - `id`
  - `ap_id`
  - `zaehleinheit_id`
  - `zielrelevant` (neu): ja/nein. Die zielrelevanten sind die Einheiten, deren Anzahlen ausgewertet und mit den Zielen verglichen werden
  - `sort` (neu): Einheiten sollen in einer bestimmten Reihenfolge angezeigt werden
  - `bemerkungen`
- :white_check_mark: neue Tabelle `ekfrequenz`, nur von managern bearbeitbar. Felder:
  - `ap_id`: Frequenzen werden pro Aktionsplan definiert. Anfänglich werden dieselben Frequenzen in alle Aktionspläne importiert.
  - `id`
  - `ek`: ja/nein. Diese Frequenz ist für EK anwendbar
  - `ekf`: ja/nein. Diese Frequenz ist für EKF anwendbar
  - `anwendungsfall`: Text. Beschreibt, in welchen Fällen diese Frequenz angewandt wird
  - `code`: Definiert die EK-Frequenz. Wird auch für den Import verwendet
  - `kontrolljahre`. Z.B.: `[2, 4, 6, 8, 10]`. Definiert, in welchen Jahren eine Kontrolle üblicherweise stattfinden soll. Bei Anpflanzungen sind das Jahre ab der letzten Anpflanzung. Bei autochthonen Populationen: Jahre ab der letzen Kontrolle
  - `bemerkungen`
  - `ek_abrechnungstyp`: Auswahl aus der Tabelle `ek_abrechnungstyp_werte`
- :white_check_mark: neue Tabelle `ek_abrechnungstyp_werte` mit den für Wertelisten üblichen Feldern
- :white_check_mark: neue Felder auf tpop:
  - `ekfrequenz`
  - `ekfrequenz_abweichend`: Diese Frequenz entspricht nicht derjenigen, welche gemäss Populationsgrösse vergeben worden wäre
  - bestehende zwei kontrollfrequenz-Felder wieder entfernen
- :white_check_mark: neue Felder auf tpopkontr:
  - `apber_nicht_relevant`: Wenn "ja" soll diese Kontrolle für den Jahresbericht nicht berücksichtigt werden (ist umgesetzt)
  - `apber_nicht_relevant_grund`: Begründen, wieso nicht berücksichtigt (ist umgesetzt)
- :white_check_mark: neue Tabelle: `ekplan` mit Feldern:
  - `tpopkontr_id`
  - `jahr`
  - `typ`: `ek` oder `ekf`

#### Termin
Sollte möglichst bald nach den Sommerferien bereit sein.
