import { Link } from 'react-router'

import { DokuDate } from '../../DesktopDocs.jsx'

export const Component = () => (
  <>
    <h1>Technologien</h1>
    <DokuDate>1.1.2023</DokuDate>
    <p>Die Anwendung ist zweigeteilt:</p>
    <ol>
      <li>
        Das <strong>Backend</strong> bietet die API (Daten-Schnittstelle)
        auf&nbsp;
        <a
          href="//api.apflora.ch/graphql"
          target="_blank"
          rel="noreferrer"
        >
          api.apflora.ch/graphql
        </a>
        &nbsp;an. Es läuft auf einem virtuellen Server.
      </li>
      <li>
        Die <strong>App</strong> bzw. das Frontend ist auf&nbsp;
        <Link to="/">apflora.ch</Link> erreichbar. Sie läuft serverless
        auf&nbsp;
        <a
          href="https://www.linode.com/"
          target="_blank"
          rel="noreferrer"
        >
          Akamai
        </a>
      </li>
    </ol>
    <p>Die wichtigsten verwendeten Technologien sind:</p>
    <ul>
      <li>
        <a
          href="//de.wikipedia.org/wiki/Docker_(Software)"
          target="_blank"
          rel="noreferrer"
        >
          docker
        </a>
        ,&nbsp;
        <a
          href="https://nodejs.org"
          target="_blank"
          rel="noreferrer"
        >
          nodejs
        </a>
        &nbsp;und&nbsp;
        <a
          href="https://caddyserver.com/"
          target="_blank"
          rel="noreferrer"
        >
          caddy
        </a>
        &nbsp;für das Backend
      </li>
      <li>
        <a
          href="https://github.com/facebook/graphql"
          target="_blank"
          rel="noreferrer"
        >
          GraphQL
        </a>
        &nbsp;in Form von&nbsp;
        <a
          href="https://github.com/graphile/crystal"
          target="_blank"
          rel="noreferrer"
        >
          PostGraphile
        </a>
        &nbsp; als API-Server (liefert die Daten vom Backend zur App)
      </li>
      <li>
        <a
          href="//vitejs.dev/"
          target="_blank"
          rel="noreferrer"
        >
          Vite
        </a>
        : Modernes Werkzeug, um dynamische Apps zu erzeugen
      </li>
      <li>
        <a
          href="//facebook.github.io/react"
          target="_blank"
          rel="noreferrer"
        >
          React
        </a>
        : Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten
      </li>
      <li>
        <a
          href="https://www.apollodata.com"
          target="_blank"
          rel="noreferrer"
        >
          Apollo
        </a>
        . Komponenten definieren, welche Daten sie brauchen. Apollo holt sie von
        PostGraphile und stellt sie bereit
      </li>
      <li>
        <a
          href="https://www.cypress.io"
          target="_blank"
          rel="noreferrer"
        >
          Cypress
        </a>
        &nbsp;für automatisierte Tests
      </li>
      <li>
        <a
          href="//postgresql.org/"
          target="_blank"
          rel="noreferrer"
        >
          PostgreSQL
        </a>
        &nbsp;als Datenbank. Hier ein&nbsp;
        <a
          href="//dbdiagram.io/d/apflora-65639a833be1495787c2f457"
          target="_blank"
          rel="noreferrer"
        >
          Diagramm der Beziehungen
        </a>
        :
        <iframe
          width="100%"
          height="800"
          src="https://dbdiagram.io/e/65639a833be1495787c2f457/67238c12b1b39dd8581538b4"
          frameBorder="0.5"
          style={{ border: '1px solid #dbdbdb' }}
        ></iframe>
      </li>
      <li>
        <a
          href="//postgis.net"
          target="_blank"
          rel="noreferrer"
        >
          PostGIS
        </a>
        &nbsp;für anspruchsvolle GIS-Funktionen
      </li>
      <li>
        <a
          href="https://leafletjs.com/"
          target="_blank"
          rel="noreferrer"
        >
          Leaflet
        </a>
        &nbsp;für die Karten
      </li>
    </ul>
  </>
)
