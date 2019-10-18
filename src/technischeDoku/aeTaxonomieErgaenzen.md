---
typ: 'technDoku'
path: "/Dokumentation/Technisch/Art-Taxonomien-ergaenzen"
date: "2019-10-18"
title: "Art-Taxonomien ergänzen"
sort: 11
---

### Herkunft der Art-Listen
Artenlisten stammen aus [arteigenschaften.ch](https://arteigenschaften.ch). Momentan werden die Arten aus der Taxonomie ["SISF Index 2 (2005)"](https://arteigenschaften.ch/Arten/aed47d41-7b0e-11e8-b9a5-bd4f79edbcc4) verwendet.<br/><br/>

### Rolle der Taxonomie in der Art-Auswahl
Arten können in drei Formularen gewählt werden:
- Aktionsplan
- Aktionsplan-Art
- assoziierte Art

Sobald der SISF Index 3 in arteigenschaften.ch eingeführt wird, sollten Arten in der Regel in dieser Taxonomie gewählt werden. Bei den AP-Arten ist es sinnvoll, Synonyme aus allen gängigen Taxonomien aufzulisten. Damit bei der Art-Auswahl die Taxonomie berücksichtigt werden kann, wird der Art ein Kürzel für die Taxonomie vorangestellt. Für "SISF Index 2 (2005)" ist das zum Beispiel "SISF2".<br/><br/>

### Technische Umsetzung
apflora ist auf künftige Indizes vorbereitet. Es muss einzig die Artenliste um den neuen Index ergänzt werden. Anschliessend können in den Formularen (oder mittels Abfragen) die Arten des neuen Index gewählt werden.<br/><br/>

Die Artliste wird von arteigenschaften.ch importiert und in der Tabelle ["ae_taxonomies"](https://github.com/barbalex/apf2/blob/master/sql/apflora/createTables.sql#L1121-L1136) gespeichert. Leider kann keine foreign table verwendet werden, weil die Beziehungen wichtig für die Referenzierung der Namen sind.<br/><br/>

Wenn der SISF3 Index in arteigenschaften.ch ergänzt wird, müssen dessen Daten in der Tabelle "ae_taxonomies" ergänzt werden, mit dem Kürzel "SISF3".<br/><br/>

Mehr Informationen [im entsprechenden Issue](https://github.com/barbalex/apf2/issues/230).

