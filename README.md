# Neues Frontend für apflora.ch

## Ziele:

- Mehrere Projekte verwalten
- Arbeiten mehrere Personen gleichzeitig, werden die Daten in der Benutzeroberfläche laufend aktualisiert
- Grundlage schaffen, um Berichte direkt aus der Webanwendung heraus produzieren zu können<br/>
  Artverantwortliche sollen Jahresberichte für ihre Arten selber erzeugen und kontrollieren können
- Grundlage schaffen, um auf das Access-Admin-Tool verzichten zu können
- Grundlage schaffen, um später allenfalls später netzunabhängig (im Feld) arbeiten zu können
- Sicherheit erhöhen
- Architektur modernisieren:
  - Unterhalt- und Erweiterbarkeit verbessern
  - Anzahl Karten-Werkzeuge auf eines reduzieren (bisher: Google-Maps und OpenLayers)
  - Es soll künftig einfacher und mit weniger Risiko verbunden sein, neue Features einzuführen
  - Einige in der alten Architektur schwierig zu lösende Fehler beheben
  - Veraltete Abhängikeiten loswerden (z.B. jsTree 2)
  - (Infra-)Struktur für Tests bereitstellen
  - Nach und nach Tests einführen
  - URL ist Teil des Flux-Stores, steuert die Benutzeroberfläche und das Laden von Daten. Vorteile:
    - Vieles ist verlinkbar
    - Auf einen Router kann verzichtet werden

## Neue Technologien:

Die wichtigsten sind:

- [create-react-app](//github.com/facebookincubator/create-react-app): Abhängigkeiten einfach aktuell halten
- [MobX](//github.com/mobxjs/mobx): Computed data wie in Excel. Und viel simpler als redux. Genial!
- [React](//facebook.github.io/react): Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten. Genial!
- [Flow](//flow.org): Static type checker. Fehler finden, bevor der Code ausgeführt wird!
- [socket.io](//socket.io/): Änderungen laufend bei allen Benutzern sichtbar machen

## Fähigkeiten:

### Neue:

- Mehrere Projekte bearbeiten
- Der Strukturbaum ist wesentlich leistungsfähiger.<br />Es gibt keine Grenzen mehr, wieviele Elemente einen Ebene darstellen kann!
- Karten:
  - Standardmässig werden Open-Street-Maps statt Swisstopo Karten als Hintergrund verwendet, um Kosten zu vermeiden. Natürlich können weiterhin Swisstopo Karten eigeblendet werden
  - Ebenen über-/untereinander stapeln
  - In der Karte verwendete Symbole werden im Ebenen-Tool und im Strukturbaum eingeblendet
  - Es werden immer alle Elemente einer Ebene angezeigt. Aktive sind gelb umrahmt
  - Bequeme(re) Messung von Flächen und Linien
  - Differenzierte(re) Darstellung der verschiedenen Typen von Beobachtungen<br />(nicht beurteilt, nicht zuzuordnen, zugeordnet)
  - Bequeme(re) Zuordnung von Beobachtungen zu Teil-Populationen
  - Bequemer(re) Darstellung von nahe bzw. direkt aufeinander liegenden Elementen

### Noch nicht realisiert:

#### Umsetzung geplant:

- Kopieren und Verschieben von Datensätzen, gemäss Absprache mit Topos
- Generell Funktionen von Version 1 prüfen und fehlende nachtragen
- Geographische Filter. Genaue Umsetzung ist noch festzulegen
- Login steuert, welche Projekte sichtbar sind
- API-Zugriff besser absichern (erst möglich, wenn Version 1 nicht mehr zugreift)

#### Umsetzung unsicher:

- Karten:
  - eigene Ebenen hineinziehen
  - eigene Ebenen bearbeiten

## Bekannte Fehler/Probleme:

Siehe [hier](//github.com/barbalex/apf2/issues).
