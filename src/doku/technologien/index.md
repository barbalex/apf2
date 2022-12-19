---
slug: 'technologien'
date: '2021-12-27'
title: 'Technologien'
sort: 27
---

Die Anwendung ist zweigeteilt:

1. Das **Backend** bietet die API (Daten-Schnittstelle) auf [api.apflora.ch/graphql](//api.apflora.ch/graphql) an. Es läuft auf einem virtuellen Server.
2. Die **App** bzw. das Frontend ist auf [apflora.ch](//apflora.ch) erreichbar. Sie läuft serverless auf [vercel](https://vercel.com)

Die wichtigsten verwendeten Technologien sind:

- [docker](<//de.wikipedia.org/wiki/Docker_(Software)>) für das Backend
- [Gatsby](//www.gatsbyjs.org): Modernes Werkzeug, um dynamische Apps auf der Grundlage von statischen Dateien zu erzeugen (die wiederum sehr effizient gehostet werden können)
- [GraphQL](https://github.com/facebook/graphql) in Form von [PostGraphile](https://github.com/graphile/postgraphile)
  - API-Server mit einer Zeile bauen und konfigurieren. Das sind _tausende_ weniger als zuvor!<br/>
  - GraphQL ist die kommende API-Technologie. Verglichen mit REST ist GraphQL einfach zu verstehen und extrem flexibel. Somit steht ein aussergewöhnlich benutzerfreundlicher API-Server zur Verfügung
- [React](//facebook.github.io/react): Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten
- [Apollo](https://www.apollodata.com). Komponenten definieren, welche Daten sie brauchen. Apollo stellt sie via GraphQL bereit
- [emotion](https://emotion.sh/docs/introduction): modular stylen
- [Cypress](https://www.cypress.io): automatisiert testen
- Als Datenbank dient [PostgreSQL](//postgresql.org/). Hier ein [Diagramm der Beziehungen](//raw.githubusercontent.com/barbalex/apf2/master/src/etc/beziehungen.png):
  ![Beziehungs-Diagramm](beziehungen.png)
