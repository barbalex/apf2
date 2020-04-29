---
typ: 'benutzerDoku'
path: "/Dokumentation/Benutzer/Karte-Drucken"
date: "2019-09-14"
title: "Karte: Drucken"
sort: 20
---

Auf der Karte gibt es zwei Schaltflächen, um:

1. Die Karte als png-Datei zu speichern
2. Die Karte zu drucken, in diesen Formaten:
   - in der aktuellen Grösse
   - A4 hoch
   - A4 quer

Leider gibt es beim Druck gelegentlich **Probleme** (Stand 14.9.2019):<br/><br/>

Die Hintergrund-Layer der Swisstopo können nicht immer gedruckt werden. Die Server der Swisstopo senden nicht immer einen sogenannten "cors-header". Fehlt dieser, scheitert der Druck. Schlimmer: Der Code von apflora hat keine Möglichkeit, das zu merken (es passiert innerhalb des verwendeten Druck-Werkzeugs). Und weil während des Drucks die Menüs auf der Karte ausgeblendet werden, erscheinen sie nach gescheitertem Druck nicht mehr :stuck_out_tongue_winking_eye:<br/><br/>

Damit sie wieder erscheinen, müsst ihr apflora dazu bringen, die Karte neu aufzubauen. Das macht ihr, indem ihr sie aus- und wieder einblendet.