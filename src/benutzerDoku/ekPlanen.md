---
typ: 'benutzerDoku'
path: "/Dokumentation/Benutzer/Erfolgs-Kontrollen-planen"
date: "2019-07-15"
title: "Erfolgs-Kontrollen planen"
sort: 10
---

Erfolgskontrollen sind gleichzeitig wichtig und aufwändig. Im Jahr 2019 wird die Verwaltung und Planung der eigentlichen Kontrollen in apflora weiter entwickelt. Ziele:
- Die Durchführung von Erfolgskontrollen kann sorgfältig geplant werden
- Topos und Artverantwortliche erhalten eine gute Übersicht über:
  - geplante EK und EKF
  - durchgeführte EK und EKF
  - Ansiedlungen
- Es wird sicher gestellt, dass für jede Art die zielrelevanten Einheiten gezählt und dokumentiert werden

### Diese Daten werden erfasst

**Global**<br/>
Durch die Koordinationsstelle. Im Strukturbaum in den Werte-Listen.
- EK-Abrechnungstypen
- Zähleinheiten
![im Strukturbaum](_media/ekplanen_global.png)<br/>

**Pro Aktionsplan**<br/>
Durch Koordinationsstelle und Artverantwortliche.
- Welche Zähleinheiten sind zielrelevant und sollen daher immer erfasst werden
- Frequenzen, nach denen in diesem AP kontrolliert werden soll. Inklusive Abrechnungstyp (EK-Frequenzen)
![im Strukturbaum](_media/ekplanen_ap.png)<br/>

**Pro Teilpopulation**<br/>
Durch Artverantwortliche. Im Formular EK-Plan(ung).
- Aus den für den AP bestimmten Frequenzen wird die für diese Teil-Population passende gewählt
- Weicht die EK-Frequenz von der auf AP-Ebene für diesen Fall bestimmten Wert ab, wird das besonders markiert ("EK-Frequenz abweichend")
- In welchen Jahren Kontrollen erfolgen sollen, differenziert nach EK und EKF

Letzteres ist die eigentliche "EK-Planung" und sie geschieht primär im entsprechenden Formular:<br/><br/>

### Formular EK-Plan(ung)
Das Formular ist für die Darstellung und Bearbeitung grosser Datenmengen konzipiert. Je grösser und höher aufgelöst der Bildschirm, desto übersichtlicher kann man arbeiten. Auf kleinen Bildschirmen (z.B. Handy) ist es kaum brauchbar.<br/><br/>

Oben links wählt man, von welchen Aktionsplänen Teil-Populationen angezeigt werden sollen:<br/>
![Formular](_media/ekplanen_form_2.png)<br/>
Sobald ein AP gewählt wurde, erscheinen die zugehörigen Teil-Populationen in der Liste. Rechts davon werden für Jahre Splaten aufgebaut. Beginnend mit dem ersten Jahr nach 1993, in dem in einer der aufgelisteten Teil-Populationen eine Kontrolle stattfand, bis 15 Jahre in die Zukunft.<br/>
![Formular](_media/ekplanen_form_1.png)<br/>

Oben rechts wählt man, welche Informationen in den Teil-Populationen angezeigt werden.<br/>![Formular](_media/ekplanen_form_3.png)<br/>

In den Zeilen für die Teilpopulationen werden in den Jahres-Spalten dargestellt:
- Grüne Haken symbolisieren ausgeführte Kontrollen ![Kontrolle](_media/ekplanen_haken.png)
- Direkt rechts des Hakens stellt eine rote Zahl die Anzahl Kontrollen dar, wenn im selben Jahr mehrere Kontrollen stattfanden ![mehrere Kontrollen im selben Jahr](_media/ekplanen_haken_multiple.png)
- Etwas weiter rechts neben dem Haken stellt eine schwarze Zahl die gemäss zielrelevanter Zähleinheit erfasste Anzahl dar, wenn diese Einheit gezählt wurde ![Zählung](_media/ekplanen_haken_zaehlung.png)
- Grüne Quadrate symbolisieren geplante Kontrollen ![geplante Kontrolle](_media/ekplanen_plan.png)
- Fand eine Kontrolle im geplanten Jahr statt, sieht man im grünen Quadrat den grünen Haken ![geplante Kontrolle fand statt](_media/ekplanen_plan_haken.png)
- Grüne Blitze symbolisieren Ansiedlungen ![Ansiedlung](_media/ekplanen_blitz.png)
- Direkt rechts des Blitzes erscheint eine rote Zahl, wenn im selben Jahr mehrere Ansiedlungen stattfanden. Sie stellt die Anzahl Ansiedlungen dar ![mehrere Ansiedlungen](_media/ekplanen_blitz_multiple.png)
- Etwas weiter rechts neben dem Blitz stellt eine schwarze Zahl die Anzahl Planzen und Triebe dar, falls erfasst ![Ansiedlung mit Zählung](_media/ekplanen_blitz_zaehlung.png)

EK's und EKF's plant man folgendermassen:
- Automatisch: Ändert man EK-Frequenz oder Startjahr und existieren sowohl Frequenz wie Startjahr, setzt apflora aufgrund der in der gewählten EK-Frequenz definierten Kontrolljahre die Pläne automatisch ![Automatisch planen](_media/ekplanen_auto.gif)
- Manuell, indem man eine Jahres-Zelle (Teilpopulation in Jahr) mit der Linken Maustaste anklickt. Es erscheint ein Menü. Hier wählt man den entsprechenden Eintrag.
![Manuell planen](_media/ekplanen_manuell.png)<br/>

Weiterführende Infos zu EK, EKF und Ansiedlungen sowie Links um sie zu öffnen findet man im selben Menü. Darin finden sich auch Links, um die Kontrolle oder Ansiedlung in einem neuen Fenster zu öffnen. ![Infos zu Ereignissen](_media/ekplanen_infos.png)<br/>