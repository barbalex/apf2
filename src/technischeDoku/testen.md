---
typ: 'technDoku'
path: "/Dokumentation/Technisch/Testen"
date: "2019-04-18"
title: "Funktionalität testen"
sort: 7
---

Nachfolgend eine Liste der Funktionalitäten, die getestet werden sollen, wenn grössere Änderungen umgesetzt wurden.<br/><br/>

Die Menge von Funktionalitäten ist eindrücklich. Vor allem, wenn man bedenkt, dass z.B. für einem Punkt allein ("Änderung speichern") 300 automatisierte Test gebaut wurden. Daher wird kaum je manuell alles erschöpfend getestet. Meist nur das, woran gearbeitet wurde.<br/><br/>

Daher ist es wichtig und geplant, langfristig alle diese Tests zu automatisieren.<br/><br/>

* alle Struktur-Elemente im Baum:
   * :white_check_mark: laden
   * :white_medium_square: filtern
   * :white_check_mark: Änderung speichern
   * :white_medium_square: Kontextmenus ausführen
   * :white_medium_square: AP-Berichte testen
* :white_medium_square: Formular-Filter
* Karte
  * alle Layer
    * :white_medium_square: anzeigen
    * :white_medium_square: Legenden anzeigen
    * :white_medium_square: stapeln
    * :white_medium_square: auf alle zoomen (apflora)
    * :white_medium_square: auf markierten zoomen (apflora)
  * Karten-Filter
    * :white_medium_square: zeichnen
    * :white_medium_square: löschen
    * :white_medium_square: im Strukturbaum zeigen
    * :white_medium_square: in Exporten verwenden
  * :white_medium_square: zoomen
  * :white_medium_square: maximieren
  * :white_medium_square: Messen
  * :white_medium_square: Download
  * Koordinaten
    * :white_medium_square: anzeigen
    * :white_medium_square: springen
  * Massstab
    * :white_medium_square: anzeigen
    * :white_medium_square: wählen
  * :white_medium_square: Distanz zeigen
  * :white_medium_square: Beobachtungen zuordnen
* :white_medium_square: Exporte
* Layout und Navigation
  * :white_medium_square: back und forward des Browsers
  * :ballot_box_with_check:Tabs ein-/ausblenden
  * :white_medium_square: breite variieren
  * :white_medium_square: Anpassung an kleine Bildschirme

Symbole:
* :white_check_mark:: automatisiert
* :ballot_box_with_check:: teilweise automatisiert
* :white_medium_square:: todo