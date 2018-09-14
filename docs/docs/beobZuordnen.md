# Beobachtungen zuordnen

Bei den wichtigsten Artförderprogrammen werden gemeldete Beobachtungen beurteilt. Sie werden entweder verworfen ("nicht zuordnen") oder einer Teilpopulation zugeordnet.

Verworfen werden Beobachtungen in der Regel, wenn:
- sie nicht (genau genug) lokalisiert werden können oder
- die Artbestimmung (zu) unsicher ist

## 1. So wird's gemacht:
Im Formular:

1. Aktionsplan wählen
2. Im Strukturbaum eine nicht beurteilte Beobachtung wählen
3. Im Formular bei "Einer Teilpopulation zuordnen" die gewünschte wählen

oder in Karten (Anleitung ausstehend)

## 2. Verfügbare Beobachtungen

- Im September 2017 wurden zuletzt alle Beobachtungen der [Info Spezies](http://www.infoflora.ch/de/allgemeines/info-species.html) und der Fachstelle Naturschutz für den Kanton Zürich integriert.
- Im April 2017 wurden die Beobachtungen des Projekts Floz integriert.

## 3. Datenstruktur

**3.1 Original-Beobachtungen nach Herkunft separat gespeichert**

Beobachtungen von Info Spezies ("beob_infospezies") und EvAB ("beob_evab") werden getrennt gespeichert.
EvAB-Beobachtungen in der Struktur, in der sie von EvabGeoDB_Master.mdb an die nationalen Zentren exportiert werden (Abfrage "vExportZDSF"). Die Daten von Info Spezies in der Struktur, die von der FNS (Andreas Baumann) aufbereitet wurde. 

Zweck: 
* Die Beobachtungen können einfach mit aktuelleren ersetzt werden
* Es ist rasch ersichtlich, wenn an der Datenstruktur etwas geändert hat
* Bei Bedarf können zusätzlich auch Beobachtungen aus einer einzelnen EvAB-DB angefügt werden

**3.2 Beobachtungen werden "bereitgestellt"**

Dabei werden grundlegende Felder aus Info Spezies und EvAB in der Tabelle "beob_bereitgestellt" vereinigt. Benötigte Felder:
* NO_NOTE (indiziert) (nur in der alten Version von apflora benutzt)
* NO_NOTE_PROJET (= ID aus EvAB) (indiziert) (nur in der alten Version von apflora benutzt)
* BeobId (= ID aus EvAB oder Info Spezies, in Text umgewandelt, indiziert)
* QuelleId (1 für EvAB, 2 für Info Spezies)
* NO_ISFS (indiziert)
* Datum (indiziert)
* Autor

Zweck:
* Mit dieser Tabelle werden die Darstellungen der Beobachtungen im Strukturbaum aufgebaut (bei: Teilpopulationen, nicht beurteilte, nicht zuzuordnende)
* Da nur die Daten der für die Anzeige in einer Liste benötigten Felder enthalten sind, ist die Tabelle viel kleiner und die Arbeitsgeschwindigkeit entsprechend höher
* Die Felder Autor und Datum sind schon aus mehreren Originalfeldern zusammengesetzt, d.h. sie müssen nicht bei jeder Abfrage zusammengesetzt werden
* Einfaches Arbeiten, da die Beobachtungen von EvAB und von Info Spezies in einer Liste enthalten sind

Um die Darstellung im Formular aufzubauen (wo alle Infos angezeigt werden sollen), wird dann direkt auf die Originaldaten in "beob_infospezies" und "beob_evab" zugegriffen.

**3.3 Infos der ApFloraDb zu Beobachtungen werden in einer eigenen Tabelle gespeichert** und zwar in der Tabelle "beobzuordnung".

Zweck: 
* Werden die Originaltabellen "beob_infospezies" und "beob_evab" aktualisiert, können sie einfach ersetzt werden, da die Arbeit der ApFlora in der Tabelle "beobzuordnung" steckt

Struktur von "beobzuordnung":
* NO_NOTE (indiziert, ID aus Info Spezies oder ID aus EvAB)
* TPopId: dieser Teilpopulation wurde die Beobachtung zugeordnet (indiziert)
* BeobNichtZuordnen: Ja oder nein. Wird ja gesetzt, wenn eine Beobachtung keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder die Beobachtung ist nicht (genau genug) lokalisierbar
* BeobBemerkungen: Bemerkungen zur Zuordnung
* MutWer, MutWann: Dokumentiert die letzte Änderung

**3.4 Nicht bearbeitete Originaldaten liegen in separater Datenbank**

Beobachtungen von Info Spezies ("beob_infospezies") und EvAB ("beob_evab") sowie die bereitgestellten Daten ("beob_bereitgestellt") liegen in der Datenbank "apflora_beob". Alle Daten von AP Flora selbst liegen in der Datenbank "apflora".

Zweck: 
* Klare Trennung der Daten nach Zuständigkeit
* Kleinere, einfachere und schnellere Datensicherung bzw. -wiederherstellung, da die Beobachtungen nicht mit gesichert werden müssen (da es sich um hunderttausende Datensätze handelt, würde das die Sicherungsdateien massiv aufblähen)

## 4. Neuere Beobachtungen aus EvAB bereitstellen

Beobachtungen aus [EvAB-GeoDB's](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) müssen mit Hilfe einer Access-Anwendung bereitgestellt werden.

Mithilfe der in EvAB enthaltenen View "vExportZDSF" wird die Tabelle erstellt, die importiert wird. Wichtig: Dabei werden im GUID (NO_NOTE_PROJET) die von Access gesetzten geschweiften Klammern entfernt, z.B. in der Tabellenerstellungsabfrage mit: `NO_NOTE_PROJET: Teil([NO_NOTE_PROJET];2;36)`

## 5. Neuere Beobachtungen der Info Flora bereitstellen

geht so:

1. aus der neuen "beob_infospezies" noch in Access alle von der FNS stammenden (und daher im EvAB-Master enthaltenen) Beobachtungen löschen:<br>
    `DELETE FROM beob_infospezies WHERE ZH_GUID is not null`
    
1. Neue und alte Beobachtungen vergleichen: Gibt es alte, die in den neuen nicht mehr vorkommen? Wenn ja: Wieso? Es kann z.B. sein, dass Beobachtungen im Umfeld des Kt. Zürich bei einer Lieferung nicht mit geliefert wurden! Müssen diese alten behalten werden? Wurden solche Beobachtungen schon Teilpopulationen zugewiesen oder verworfen? Falls ja: Diese Beobachtungen in separate Tabelle auslagern und nach dem Import wieder anfügen

1. Es empfiehlt sich auch, die Beobachtungen aus dem Projekt der AP Flora NICHT zu importieren (bisher sind die offenbar noch nicht enthalten?)

TODO: beim nächsten Import genauer beschreiben