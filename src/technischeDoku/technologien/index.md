---
typ: 'technDoku'
path: "/Dokumentation/Technisch/Technologien"
date: "2020-03-31"
title: "Technologien"
sort: 2
---

Die Anwendung ist zweigeteilt:

1. Das **Backend** bietet die API (Daten-Schnittstelle) auf [api.apflora.ch/graphql](//api.apflora.ch/graphql) an.<br/>
  Es läuft auf einem virtuellen Server.
2. Die **App** bzw. das Frontend ist auf [apflora.ch](//apflora.ch) erreichbar. Sie läuft serverless auf [Zeit/now](https://zeit.co/now)

Die wichtigsten verwendeten Technologien sind:

- [docker](//de.wikipedia.org/wiki/Docker_(Software)) für das Backend
- [Gatsby](//www.gatsbyjs.org): Modernes Werkzeug, um dynamische Apps auf der Grundlage von statischen Dateien zu erzeugen (die wiederum sehr effizient gehostet werden können)
- [GraphQL](https://github.com/facebook/graphql) in Form von [PostGraphile](https://github.com/graphile/postgraphile)
  - API-Server mit einer Zeile bauen und konfigurieren. Das sind _tausende_ weniger als zuvor!<br/>
  - GraphQL ist die kommende API-Technologie. Verglichen mit REST ist GraphQL einfach zu verstehen und extrem flexibel. Somit steht ein aussergewöhnlich benutzerfreundlicher API-Server zur Verfügung
- [React](//facebook.github.io/react): Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten. Ausschliesslich funktionale Komponenten mit [hooks](https://reactjs.org/docs/hooks-intro.html)
- [Apollo](https://www.apollodata.com). Komponenten definieren, welche Daten sie brauchen. Apollo stellt sie via GraphQL bereit
- [styled-components](https://github.com/styled-components/styled-components): modular stylen
- [Cypress](https://www.cypress.io): automatisiert testen
- Als Datenbank dient [PostgreSQL](//postgresql.org/). Hier ein [Diagramm der Beziehungen](//raw.githubusercontent.com/barbalex/apf2/master/src/etc/beziehungen.png):
  ![Beziehungs-Diagramm](beziehungen.png)