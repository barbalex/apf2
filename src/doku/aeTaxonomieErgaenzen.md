---
slug: 'art-taxonomien-ergaenzen'
date: '2021-12-27'
title: 'Art-Taxonomien ergänzen'
sort: 35
---

### Herkunft der Art-Listen

Artenlisten stammen aus [arteigenschaften.ch](https://arteigenschaften.ch). Momentan werden die Arten aus den Taxonomien ["SISF (2005)"](https://arteigenschaften.ch/Arten/aed47d41-7b0e-11e8-b9a5-bd4f79edbcc4) und ["DB-TAXREF (2017)"](https://arteigenschaften.ch/Arten/c87f19f2-1b77-11ea-8282-bbc40e20aff6) verwendet.<br/><br/>

### Rolle der Taxonomie in der Art-Auswahl

Arten können in drei Formularen gewählt werden:

- Art
- Taxon
- assoziierte Art

In der Regel sollten Arten aus der Taxonomie "DB-TAXREF (2017)" gewählt werden. Bei den AP-Arten ist es sinnvoll, Synonyme aus allen gängigen Taxonomien aufzulisten.<br/><br/>

Damit bei der Art-Auswahl die Taxonomie berücksichtigt werden kann, wird der Art ein Kürzel für die Taxonomie vorangestellt. Für "SISF Index 2 (2005)" ist das zum Beispiel "Info Flora 2005".<br/><br/>

### Technische Umsetzung

apflora ist auf künftige Indizes vorbereitet. Es muss einzig die Artenliste um den neuen Index ergänzt werden (wie ist [hier](https://github.com/barbalex/apf2/blob/master/sql/apflora/createTables.sql#L2467-L2486) erklärt). Anschliessend können in den Formularen (oder mittels Abfragen) die Arten des neuen Index gewählt werden.<br/><br/>

Die Artliste wird von arteigenschaften.ch importiert und in der Tabelle ["ae_taxonomies"](https://github.com/barbalex/apf2/blob/master/sql/apflora/createTables.sql#L2447-L2465) gespeichert. Leider kann keine foreign table verwendet werden, weil die Beziehungen wichtig für die Referenzierung der Namen sind.<br/><br/>

Mehr Informationen [im entsprechenden Issue](https://github.com/barbalex/apf2/issues/230).
