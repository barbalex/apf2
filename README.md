#Neues Frontend für apflora.ch

verwendet:

- [create-react-app](//github.com/facebookincubator/create-react-app)
- [MobX](//github.com/mobxjs/mobx)
- [socket.io](//socket.io/)

##Ziele:

- mehrere Projekte verwalten
- wenn mehrere Personen gleichzeitig arbeiten werden die Daten in der Benutzeroberfläche laufend aktualisiert
- Grundlage schaffen, um Berichte direkt aus der Webanwendung heraus produzieren zu können<br/>
  Artverantwortliche sollen Jahresberichte für ihre Arten selber erzeugen und kontrollieren können
- Grundlage schaffen, um auf das Access-Admin-Tool verzichten zu können
- Grundlage schaffen, um später allenfalls später netzunabhängig (im Feld) arbeiten zu können
- Sicherheit erhöhen
- Architektur modernisieren:
  - Unterhalt- und Erweiterbarkeit verbessern
  - Anzahl Karten-Werkzeuge auf eines reduzieren (bisher: Google-Maps und OpenLayers)
  - es soll künftig einfacher und mit weniger Risiko verbunden sein, neue Features einzuführen
  - einige in der alten Architektur schwierig zu lösende Fehler beheben
  - veraltete Abhängikeiten loswerden (z.B. jsTree 2)
  - (Infra-)Struktur für Tests bereitstellen
  - nach und nach Tests einführen
  - URL ist Teil des Flux-Stores, steuert die Benutzeroberfläche und das Laden von Daten. Vorteile:
    - vieles ist verlinkbar
    - auf einen Router kann verzichtet werden
