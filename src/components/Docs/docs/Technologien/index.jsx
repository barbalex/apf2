import { DokuDate } from '../..'
import beziehungen from './beziehungen.png'

const Technologien = () => (
  <>
    <h1>Technologien</h1>
    <DokuDate>1.1.2023</DokuDate>
    <p>Die Anwendung ist zweigeteilt:</p>
    <ol>
      <li>
        Das <strong>Backend</strong> bietet die API (Daten-Schnittstelle) auf{' '}
        <a href="//api.apflora.ch/graphql">api.apflora.ch/graphql</a> an. Es
        läuft auf einem virtuellen Server.
      </li>
      <li>
        Die <strong>App</strong> bzw. das Frontend ist auf{' '}
        <a href="//apflora.ch">apflora.ch</a> erreichbar. Sie läuft serverless
        auf{' '}
        <a href="https://vercel.com" target="_blank" rel="noreferrer">
          vercel
        </a>
      </li>
    </ol>
    <p>Die wichtigsten verwendeten Technologien sind:</p>
    <ul>
      <li>
        <p>
          <a
            href="//de.wikipedia.org/wiki/Docker_(Software)"
            target="_blank"
            rel="noreferrer"
          >
            docker
          </a>{' '}
          für das Backend
        </p>
      </li>
      <li>
        <p>
          <a href="//vitejs.dev/" target="_blank" rel="noreferrer">
            Vite
          </a>
          : Modernes Werkzeug, um dynamische Apps zu erzeugen
        </p>
      </li>
      <li>
        <p>
          <a
            href="https://github.com/facebook/graphql"
            target="_blank"
            rel="noreferrer"
          >
            GraphQL
          </a>{' '}
          in Form von{' '}
          <a
            href="https://github.com/graphile/postgraphile"
            target="_blank"
            rel="noreferrer"
          >
            PostGraphile
          </a>
        </p>
        <ul>
          <li>
            API-Server mit einer Zeile bauen und konfigurieren. Das sind{' '}
            <em>tausende</em> weniger als zuvor!
          </li>
          <li>
            GraphQL ist die kommende API-Technologie. Verglichen mit REST ist
            GraphQL einfach zu verstehen und extrem flexibel. Somit steht ein
            aussergewöhnlich benutzerfreundlicher API-Server zur Verfügung
          </li>
        </ul>
      </li>
      <li>
        <p>
          <a href="//facebook.github.io/react" target="_blank" rel="noreferrer">
            React
          </a>
          : Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten
        </p>
      </li>
      <li>
        <p>
          <a href="https://www.apollodata.com" target="_blank" rel="noreferrer">
            Apollo
          </a>
          . Komponenten definieren, welche Daten sie brauchen. Apollo stellt sie
          via GraphQL bereit
        </p>
      </li>
      <li>
        <p>
          <a
            href="https://emotion.sh/docs/introduction"
            target="_blank"
            rel="noreferrer"
          >
            emotion
          </a>
          : modular stylen
        </p>
      </li>
      <li>
        <p>
          <a href="https://www.cypress.io" target="_blank" rel="noreferrer">
            Cypress
          </a>
          : automatisiert testen
        </p>
      </li>
      <li>
        <p>
          Als Datenbank dient{' '}
          <a href="//postgresql.org/" target="_blank" rel="noreferrer">
            PostgreSQL
          </a>
          . Hier ein{' '}
          <a
            href="//raw.githubusercontent.com/barbalex/apf2/master/src/etc/beziehungen.png"
            target="_blank"
            rel="noreferrer"
          >
            Diagramm der Beziehungen
          </a>
          :
          <img src={beziehungen} alt="Beziehungs-Diagramm" width="100%" />
        </p>
      </li>
    </ul>
  </>
)

export default Technologien
