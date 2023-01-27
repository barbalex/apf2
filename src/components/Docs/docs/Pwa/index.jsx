import { DokuDate } from '../..'
import installieren from './installieren.png'

const PWA = () => (
  <>
    <h1>Progressive Web App</h1>
    <DokuDate>27.12.2021</DokuDate>
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
      &quot;Progressive Web Apps&quot; sind Web-Apps und werden für Browser
      entwickelt. Weil sie einige zusätzliche Anforderungen erfüllen, können sie
      je länger je weniger von &quot;normalen&quot; Apps unterschieden werden.
    </p>
    <p>
      <strong>Was ist der Unterschied zu einer gewöhnlichen Web-App?</strong>
    </p>
    <ul>
      <li>
        Sie können apflora auf Desktop/Startseite platzieren bzw.
        &quot;installieren&quot;.
        <ul>
          <li>
            In Chrome auf PC und Mac öffnen Sie dazu das Menü ganz oben rechts:
            <br />
            <img src={installieren} alt="installieren" />
            <br />
            In der URL-Zeile finden Sie dafür ein Symbol.
          </li>
          <li>
            Auf Android werden Sie von Chrome gefragt, ob sie apflora auf dem
            Startbildschirm platzieren wollen.
          </li>
        </ul>
      </li>
      <li>
        Danach hat apflora eine eigene Verknüpfung und startet ausserhalb des
        Browsers in einem eigenen Fenster, ohne URL-Zeile.
      </li>
      <li>
        Auch apflora-Links sollen bald mit der installierten Version geöffnet
        werden (funktioniert auf Android schon).
      </li>
    </ul>
    <p>
      <strong>
        Was ist der Unterschied zu einer traditionellen Applikation?
      </strong>
    </p>
    <ul>
      <li>
        Die App funktioniert auf allen Bertriebssystemen und auf allen Geräten
        mit modernem Browser
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

export default PWA
