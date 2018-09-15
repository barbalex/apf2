# Beobachtungen zuordnen

Bei den wichtigsten Artförderprogrammen werden gemeldete Beobachtungen beurteilt. Sie werden entweder verworfen ("nicht zuordnen") oder einer Teilpopulation zugeordnet.

Verworfen werden Beobachtungen in der Regel, wenn:
- sie nicht (genau genug) lokalisiert werden können oder
- die Artbestimmung (zu) unsicher ist

## 1. So wird's gemacht
Im Formular:

1. Aktionsplan wählen
2. Im Strukturbaum eine nicht beurteilte Beobachtung wählen
3. Im Formular bei "Einer Teilpopulation zuordnen" die gewünschte wählen

oder in Karten (Anleitung ausstehend)

## 2. Verfügbare Beobachtungen

- Im September 2017 wurden zuletzt alle Beobachtungen der [Info Spezies](http://www.infoflora.ch/de/allgemeines/info-species.html) und der Fachstelle Naturschutz für den Kanton Zürich integriert.
- Im April 2017 wurden die Beobachtungen des Projekts Floz integriert.

## 3. Datenstruktur

(veraltet, Aktualisierung ausstehend)

Beobachtungen werden in der Tabelle `beob` gespeichert:<br/>
![Tabelle beob](./_media/beobTable.png)

Ein Datensatz besteht aus jeweils zwei Teilen:

1. Den unveränderten Originaldaten der Beobachtung, enthalten im JSONB-Feld `data`
2. Extrahierten bzw. abgeleiteteten Daten, welche für das effiziente Funktionieren von apflora.ch benötigt werden, in den übrigen Feldern

Zur Extraktion der Originaldaten aus EvAB wird die in EvAB enthaltene Abfrage `vExportZDSF` verwendet. Daten von Info Spezies werden in derjenigen Struktur importiert, wie sie von der FNS aufbereitet wurden. 

Zweck dieser Datenstruktur: 
* Die Struktur von Beobachtungsdaten ist im Prinzip unerheblich. Änderungen daran auch nicht. Wichtig ist einzig, dass zum Zeitpunkt des Imports klar ist, wie aus den Beobachtungsdaten die abgeleiteten Felder in Tabelle `beob` generiert werden können
* Somit können jederzeit Beobachtungen unabhängig von ihrer Datenstruktur importiert werden
* Schon vorhandene Beobachtungen können bei erneutem Import mit aktuelleren ersetzt werden (`quelle_id` und `id_field` vergleichen)
* Mit Hilfe der abgeleiteten Felder können gebaut werden:
  * der Strukturbaum
  * das Beobachtungs-Formular


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