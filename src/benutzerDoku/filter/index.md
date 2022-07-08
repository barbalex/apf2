---
typ: 'benutzerDoku'
path: '/Dokumentation/Benutzer/Filter'
date: '2022-07-08'
title: 'Filter'
sort: 14
---

Filtern hat in apflora eine lange Geschichte und wurde Schritt um Schritt erweitert.<br/>
Zuletzt im Juli 2022.<br/>

## Welche Filter gibt es?

### Navigationsbaum, Hiearchie-Filter

Die Position in der aktuellen Navigation beeinflusst den aktuell angewandten Filter.<br/><br/>

Beispiele:<br/>

- Wechseln Sie mit offener Karte und darauf eingeblendeten Populationen von Art zu Art, werden immer deren jeweiligen Populationen angezeigt.
- Wechseln Sie mit offener Karte und darauf eingeblendeten Teil-Populationen von Population zu Population, werden immer deren jeweiligen Teil-Populationen angezeigt.

### Navigationsbaum, Label-Filter

Im Navigationsbaum gibt es oben links den Label-Filter. Er heisst jeweils so, wie die entsprechene Ebene, auf der man sich befindet. Z.B. "Arten filtern" oder "Populationen filtern".<br/>
![Navigationsbaum-Filter](nav_label_filter_1.png)<br/>

Beispiel:<br/>
Erfassen Sie im Label-Filter auf Stufe Art "carex", wird nach den Arten mit dieser Zeichenfolge im Namen gefiltert.<br/><br/>

### Navigationsbaum, nur-AP-Filter

Weil das Anzeigen nur der AP-Arten ein häufiger Vorgang ist (und es früher keine oder-Filterung gab), kann man im Navigationsbaum oben recht mit einem Klick diesen Filter ein- oder ausschalten.<br/>
![nur-AP-Filter](nur_ap_filter_1.png)<br/><br/>

### Karten-Filter

Auf der Karte kann man im Layer-Tool oben rechts unter `apflora` ein Werkzeug für Karten-Filter einschalten. Danach erscheinen in der Karte oben links Werkzeuge zum Zeichnen eines Umrisses, für dessen Bearbeitung und Löschung.<br/>
![Karten-Filter](karten_filter_1.png)<br/>

Ist ein Umriss gezeichnet, wird er auf die Filter der Stufe Population und Teil-Population angewandt. Es werden also nur noch Populationen angezeigt, die innerhalb dieses Umrisses liegen.<br/><br/>

### Formular-Filter

Das ist der leistungsfähigste Filter.<br/><br/>

Den Formular-Filter öffnet man mit der Schaltfläche oben in der Navigationszeile, rechts neben der Daten-Schaltfläche<br/>
![Filter öffnen](formular_filter_1.png)
<br/>

Es gibt ihn für diese Formulare:

- Art
- Population
- Teil-Population
- Massnahmen
- Feld-Kontrollen
- Freiwilligen-Kontrollen (nur in der Normal-Ansicht. Freiwillige können das also nicht)

Filter-Formulare entsprechen (fast) genau den normalen Formularen. Sie sind aber orange hinterlegt, damit nicht aus Versehen beim Filtern echte Daten verändert werden.<br/>
![Formular-Filter](formular_filter_2.png)<br/>

Erfasst man in einem Filter-Feld Daten, wird der entsprechende Filter nach Verlassen des Feldes oder nach Drücken der Enter-Taste angewendet (bei Auswahl-Feldern sofort).<br/><br/>

Filtern kann man im `Strukturbaum` _und_ im `Strukturbaum 2`. Öffnet man den `Strukturbaum 2`, entspricht er genau dem `Strukturbaum`, d.h. es wird auch ein allfälliger Filter kopiert. Danach sind die Filter unabhängig im jeweiligen Navigationsbaum gültig.<br/><br/>

#### Und-Filter

Erfasst man in einem Filter-Formular in mehreren Feldern Werte, müssen diese gleichzeitig bzw. kummulativ erfüllt sein.<br/><br/>

Beispiel:<br/>

Erfasst man im Filter-Formular für die Art `Aktionsplan = erstellt` UND `Stand Umsetzung = in Umsetzung`, werden Arten gefiltert, deren Aktionsplan erstellt ist und sich in Umsetzung befindet.<br/><br/>

#### Oder-Filter

Im Formular-Filter gibt es bei Arten, Populationen und Teil-Populationen nummerierte Register. Und rechts daneben ein (zunächst inaktives) mit `oder` beschriftetes.<br/>
![Register](formular_filter_3.png)<br/>

Die Nummern nummerieren Kriterien der Oder-Filterung. Sobald in einem Register ein Wert erfasst wurde (oder mehrere, siehe Und-Filter), wird das mit `oder` beschriftete Register aktiv. Klickt man darauf und erfasst darin weitere Werte, hat man eine Oder-Filterung geschaffen. Will heissen: Es wird nach Datensätzen gefiltert, die entweder die Kriterien im Register 1 oder diejenigen im Register 2 erfüllen. Es können beliebig viele Register gechaffen werden.<br/><br/>

Beispiel:<br/>
Will man alle ursprünglichen Populationen, filtert man im Filter-Formular für Populationen nach `ursprünglich, aktuell` oder `ursprünglich, erloschen`.<br/><br/>

## Wo werden Filter angewendet?

- Im Navigationsbaum auf der gefilterten Ebene.
- In der Karte (Populationen, Teil-Populationen).
- In einigen Exporten gibt es zwei Befehle: Neben dem normalen, der alle Objekte (die Sie zugreifen dürfen) ungefiltert exportiert, einen zusätzlichen der den aktuellen Filter anwendet.

## Es gibt so viele Filter. Wie spielen sie zusammen?

Grundsätzlich additiv. Will heissen: sie werden alle gleichzeitig angewandt.<br/><br/>

Wenn Sie im Formular-Filter mach mehreren oder-Kriterien filtern, werden alle übrigen Filter bei jedem einzelnen oder-Kriterium additiv d.h. zusätzlich angewandt.<br/><br/>

Das geht sogar so weit, dass Filter von hierarchisch höheren Filtern beeinflusst werden.<br/><br/>

Beispiel:<br/>
Sie haben folgende Filter gesetzt:

- Im Navigationsbaum-Label-Filter `Art filtern: "carex"`
- Im Navigationsbaum den "nur AP"-Filter eingeschaltet
- Im Filter-Formular für Populationen die Kriterien `Status = "angesiedelt aktuell"` oder `Status = "angesiedelt erloschen"`
- Im Karten-Filter haben Sie den Sie interessierenden Umriss gezeichnet

Resultat:<br/>
Im Navigationsbaum, in der Karte und in den filterbaren Exporten sehen Sie nur noch ursprüngliche Populationen der drei Carex-Arten, für die Aktionspläne bestehen oder vorgesehen sind und die im interessierenden Gebiet liegen.<br/>
![Zusammenspiel](zusammenspiel.png)<br/>

## Wie werden Filter entfernt?

Im Formular-Filter gibt es oben drei Symbole:<br/>
![Entfernen](entfernen_1.png)<br/>

- Mit dem linken Symbol kann man das aktuelle Filterkriterium der oder-Filterung entfernen
- Mit dem mittleren Symbol kann man den Filter (alle oder-Kriterien) in der aktiven Ebene entfernen (z.B. Population). Dabei bleiben Filter in anderen Ebenen erhalten (z.B. Art)
- Mit dem rechten Symbol kann man alle angewendeten Filter entfernen. Das betrifft auch Navigationsbaum-Label-Filter, nur-AP-Filter und Karten-Filter. Nicht aber den hierarchischen Navigationsbaum-Filter (dafür wäre eine Navigation nötig und weil es nicht sicher ist, dass Sie das wollen, müssen selber navigieren)

## Es gibt so viele Filter. Wie weiss ich, welche aktiv sind?

Sie können natürlich im Navigationsbaum, in der Karte und im Formular-Filter an allen relevanten Orten nachschauen.<br/><br/>

Eine gute Übersicht erhalten Sie aber im Formular-Filter der jeweiligen Ebene. Dort wird nämlich aufgelistet, welche der übrigen Filter auf dieser Ebene wirksam sind.<br/>
![Übersicht](uebersicht_1.png)<br/><br/>
