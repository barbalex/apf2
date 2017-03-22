# Neues Frontend für apflora.ch

verwendet:

- [create-react-app](//github.com/facebookincubator/create-react-app)
- [MobX](//github.com/mobxjs/mobx)
- [socket.io](//socket.io/)

## Ziele:

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

## Fähigkeiten:

### Neue:

- Karten
  - Standardmässig werden Open-Street-Maps als Hintergrund verwendet, statt Swisstopo Karten. Grund: Kosten vermeiden
  - Ebenen über-/untereinander stapeln
  - In der Karte verwendete Symbole werden im Ebenen-Tool und im Strukturbaum eingeblendet
  - Es werden immer alle Elemente einer Ebene angezeigt: aktive sind gelb umrahmt
  - Bequeme(re) Messung von Flächen und Linien
  - Differenzierte(re) Darstellung der verschiedenen Typen von Beobachtungen (nicht beurteilt, nicht zuzuordnen, zugeordnet)
  - Bequeme(re) Zuordnung von Beobachtungen zu Teil-Populationen
  - Bequemer(re) Darstellung von nahe bzw. direkt aufeinander liegenden Elementen

### Noch nicht realisiert:

#### Umsetzung geplant:

- Kopieren und Verschieben von Datensätzen, gemäss Absprache mit Topos
- Generell Funktionen von v1 prüfen und fehlende nachtragen

#### Umsetzung unsicher:

- Karten
  - eigene Ebenen hineinziehen

## Bekannte Fehler/Probleme:

Siehe [hier](https://github.com/FNSKtZH/apflora/issues?q=is%3Aopen+is%3Aissue+label%3Av2).
