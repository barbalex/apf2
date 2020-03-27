---
typ: 'benutzerDoku'
path: "/Dokumentation/Benutzer/ap-auswertung-pop-menge"
date: "2020-03-27"
title: "AP: Auswertung Population Mengen"
sort: 9
---

### Rahmen-Bedingungen
- Pro Jahr
- Ebene AP
- Pop mit der Menge ihrer aus allen TPop summierten ziel-relevanten Einheit aus der jüngsten Zählung oder Anpflanzung

### Basis-Daten
- Ap, Pop und TPop aus den jährlich historisierten Daten: `ap_history`, `pop_history` und `tpop_history`
  - nur Pop und TPop mit den Stati 100, 200, 201
  - nur für den AP-Bericht relevante TPop
- Die für das entsprechende Jahr jüngste Kontrolle
  - mit der ziel-relevanten Einheit
  - mit einer Anzahl
  - von TPop mit Status 100, 200, 201
- Die für das entsprechende Jahr jüngste Anpflanzung
  - wenn danach (noch) keine Kontrolle erfolgte
  - mit der ziel-relevanten Einheit
  - mit einer Anzahl
  - von TPop mit Status 200 oder 201

Mehr zu der Historisierung von AP, Pop und TPop hier: https://apflora.ch/Dokumentation/Benutzer/historisierung
