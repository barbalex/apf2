import { DokuDate } from '../../DesktopDocs.jsx'
import installieren from './installieren.png'

export const Component = () => (
  <>
    <h1>Progressive Web App</h1>
    <DokuDate>21.12.2024</DokuDate>
    <p>
      apflora.ch ist eine{' '}
      <a
        href="https://developers.google.com/web/progressive-web-apps"
        target="_blank"
        rel="noreferrer"
      >
        <strong>Progressive Web App</strong>
      </a>{' '}
      (PWA).
    </p>
    <p>
      &quot;Progressive Web Apps&quot; sind für den Browser entwickelte
      Web-Applikationen. Weil sie einige zusätzliche Anforderungen erfüllen,
      können sie je länger je weniger von &quot;normalen&quot; Applikationen
      unterschieden werden.
    </p>
    <p>
      <strong>Was ist der Unterschied zu einer gewöhnlichen Web-App?</strong>
    </p>
    <ul>
      <li>
        Sie können apflora &quot;installieren&quot; (müssen aber nicht)
        <ul>
          <li>
            Wie, hängt vom Browser ab und kann im gleichen Browser auch von Zeit
            zu Zeit ändern 🙄
          </li>
          <li>
            In Chrome auf PC finden Sie in der URL-Zeile rechts dafür ein Symbol
          </li>
          <li>
            Auf Android werden Sie von Chrome gefragt, ob sie apflora auf dem
            Startbildschirm platzieren bzw. installieren wollen
          </li>
        </ul>
      </li>
      <li>
        Danach hat apflora eine eigene Verknüpfung und startet ausserhalb des
        Browsers in einem eigenen Fenster, ohne URL-Zeile
      </li>
      <li>
        Auch apflora-Links sollen bald mit der installierten Version geöffnet
        werden (funktioniert auf Android schon)
      </li>
    </ul>
    <p>
      <strong>
        Was ist der Unterschied zu einer traditionellen Applikation?
      </strong>
    </p>
    <ul>
      <li>
        Die App funktioniert auf allen Geräten mit modernem Browser, unabhängig
        vom Betriebssystem
      </li>
      <li>Statt die App zu installieren, müssen Sie nur apflora.ch besuchen</li>
      <li>Updates erfolgen automatisch</li>
      <li>
        Einer neuen Mitarbeiterin schicken Sie einfach URL und Login. Schon kann
        sie loslegen!
      </li>
    </ul>
  </>
)
