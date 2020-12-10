---
typ: 'benutzerDoku'
path: '/Dokumentation/Benutzer/historisierung'
date: '2020-12-10'
title: 'Historisierung von AP, Pop und TPop'
sort: 16
---

## Wunsch

Stand: Ende 2019<br/><br/>

Die Daten in apflora werden je länger je intensiver ausgewertet. <br/><br/>

Beispiele:

- Unmittelbar bevor steht die grafische Darstellung der zeitlichen Änderung (von Jahr zu Jahr) der Anzahl Populationen und ihrer Grösse gemäss ziel-relevanter Zähleinheit, differenziert nach Status.
- Der Jahresbericht soll ergänzt werden um "Differenzen zum Vorjahr": "die Anzahl Populationen, die es gegenüber dem Vorjahr zusätzlich oder weniger hat (oder 0, falls stabil), bei den ursprünglichen, bei den angesiedelten Pop und im Total".
- Die Priorisierung von AP-Arten ist abhängig von der Zu- oder Abnahme der Anzahl ursprünglicher Populationen (Spalte K) und der Anzahl Populationen total (ursp. und angesiedelt, Spalte L) und der Zielerreichung (nicht erfolgreich bis sehr erfolgreich, Spalte G)

## Aktuelle Situation

Stand: Ende 2019<br/><br/>

Das Problem ist, dass die Daten von AP, Pop und TPop bei jeder Aktualisierung überschrieben werden. Die Veränderung mit der Zeit ist so nicht auswertbar.<br/><br/>

Mit der aktuellen Datenstruktur ist es wohl möglich, nachzuvollziehen, in welchen Jahren Populationen geschaffen wurden. Das heisst: **In welchem Jahr gab es wie viele Populationen**. Wenn ihr es zuverlässig nachführt, kann das Feld "Bekannt seit" dafür verwendet werden. Davon gehe ich aus. Bloss: Wenn eine Population entfernt wird, verschwindet sie dann auch in den Vorjahren aus der Statistik 🤔. Das sollte vermutlich nicht passieren, passiert aber vermutlich schon.<br/><br/>

Hingegen ist es nicht möglich, zu **wissen, wann Stati geändert wurden**. Bzw. in welchem Jahr eine Population welchen Status hatte.<br/><br/>

## Lösung

- Ein mal im Jahr (wenn der Jahresbericht erzeugt wird) werden alle AP, Pop und TPop in eigene Tabellen kopiert
  Nachtrag am 10.12.2020: Im verlauf eines Jahrs können die Daten jederzeit historisiert werden, bis spätestens Ende März des Folgejahrs. Wurde das betreffende Jahr schon historisiert, werden die alten Daten einfach überschrieben
- Abfragen könnten Historien verwenden, um die Änderung wesentlicher Felder wie z.B. Status oder AP-Bearbeitungsstand auszulesen
- Daten für Vorjahre wurden aus Sicherungen importiert

## Umsetzung

- Es gibt drei neue Tabellen:
  - `ap_history`
  - `pop_history`
  - `tpop_history`
- Diese Tabellen haben dieselbe Struktur wie die jeweilige "Mutter"-Tabelle. Plus ein Jahr
- Jahr und ap/pop/tpop-id sind zusammen eindeutig
- Es gibt eine Funktion, um:
  - alle aktuellen ap/pop/tpop in diese Tabellen zu kopieren
  - und mit dem **VOR**-Jahr zu ergänzen (weil man das wohl gegen Ende Februar des Folge-Jahrs macht)
- In der Tabelle `apberuebersicht` gibt es ein neues Feld: history_date. Es wird von apflora gesetzt, wenn obige Funktion ausgeführt wird
- Im Formular "AP-Berichte" > "AP-Bericht Jahresübersicht"
  - Gibt es einen neuen Befehl "AP, Pop und TPop historisieren, um den zeitlichen Verlauf auswerten zu können"
  - Dieser Befehl kann nur von Managern ausgeführt werden
  - Er kann nur ein Mal durchgeführt werden (sollte er ein mal zu früh ausgeführt worden sein und wiederholt werden müssen, müsstet ihr Alex darum bitten)
  - Solltet ihr einmal vergessen, diesen Befehl im richtigen Moment auszuführen, müsste ich mit Daten aus Sicherungen dies nachträglich manuell machen
  - Sobald er ausgeführt wurde, sieht man die Daten dieses Jahresberichts in den Auswertungen
- Ich importiere Daten aus Sicherungen früherer Jahre, die gegen Ende Februar stattfanden, in die historien-Tabellen. Ich muss schauen, wie weit zurück das wie gut geht, weil z.T. ev. strukturelle Anpassungen stattfanden. Je nach vertretbarem Aufwand, versuche ich das so weit zurück auszuführen, wie die Stati vernünftig mit den aktuell verwendeten verglichen werden können

## Daten

Aus Sicherungen wurden importiert: <br/><br/>

### ap

| Jahr | Anzahl Datensätze |
| ---- | ----------------- |
| 2014 | 471               |
| 2015 | 524               |
| 2016 | 561               |
| 2017 | 572               |
| 2018 | 573               |

### pop

| Jahr | Anzahl Datensätze |
| ---- | ----------------- |
| 2014 | 4557              |
| 2015 | 5208              |
| 2016 | 5610              |
| 2017 | 5932              |
| 2018 | 6414              |

### tpop

| Jahr | Anzahl Datensätze |
| ---- | ----------------- |
| 2014 | 7791              |
| 2015 | 9155              |
| 2016 | 10116             |
| 2017 | 10930             |
| 2018 | 11975             |
