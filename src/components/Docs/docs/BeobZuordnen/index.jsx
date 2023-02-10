import { DokuDate } from '../..'
import YoutubeEmbed from '../../../shared/YoutubeEmbed'
import beobZuordnen from './beobZuordnen_01.png'

const BeobZuordnen = () => (
  <>
    <h1>Beobachtungen Teil-Populationen zuordnen</h1>
    <DokuDate>05.06.2019</DokuDate>
    <p>
      Bei den wichtigsten Artförderprogrammen werden gemeldete Beobachtungen
      beurteilt. Sie werden entweder verworfen (&quot;nicht zuordnen&quot;) oder
      einer Teilpopulation zugeordnet.
    </p>
    <p>Verworfen werden Beobachtungen in der Regel, wenn:</p>
    <ul>
      <li>sie nicht (genau genug) lokalisiert werden können oder</li>
      <li>die Artbestimmung (zu) unsicher ist</li>
    </ul>
    <h2>1. So wird&#39;s gemacht</h2>
    <h3>1.1 Im Formular</h3>
    <ol>
      <li>Art wählen</li>
      <li>Im Strukturbaum eine nicht beurteilte Beobachtung wählen</li>
      <li>
        Im Formular bei &quot;Einer Teilpopulation zuordnen&quot; die gewünschte
        wählen
      </li>
    </ol>
    <h3>1.2 in Karten</h3>
    <p>Gemäss diesem Video:</p>
    <YoutubeEmbed embedId={'Oy-TDV37xhI'} />
    <h3>1.3 Im Strukturbaum</h3>
    <p>
      Hier gibt es zwei Methoden, die mit einem einzigen Klick ausgelöst werden
      können:
    </p>
    <ul>
      <li>
        neue Population und Teil-Population gründen und die Beobachtung der
        neuen Teil-Population zuordnen
      </li>
      <li>
        neue Teil-Population in bestehender Population gründen und die
        Beobachtung der neuen Teil-Population zuordnen. Die gewünschte
        Population kann aus einer Liste gewählt werden
      </li>
    </ul>
    <img src={beobZuordnen} alt="im Strukturbaum" />
    <h2>2. Verfügbare Beobachtungen</h2>
    <p>
      Episodisch und bei Bedarf werden Beobachtungen importiert. Ziel:
      mindestens ein mal jährlich. Folgende Importe haben bisher stattgefunden:
    </p>
    <ul>
      <li>2016: 228&#39;791 von der Fachstelle Naturschutz</li>
      <li>
        2017: 192&#39;606 von{' '}
        <a href="https://www.infoflora.ch/de/allgemeines/info-species.html">
          Info Spezies
        </a>
      </li>
      <li>
        2017: 30&#39;935 des Projekts{' '}
        <a href="https://www.floz.zbg.ch/" target="_blank" rel="noreferrer">
          Floz
        </a>{' '}
        (offenbar nur Herbarbelege)
      </li>
      <li>
        2021: 17&#39;638 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (nur für von Topos ausgewählte Arten)
      </li>
      <li>
        2022.01: 459 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (von den Art-Verantwortlichen neu erfasste)
      </li>
      <li>
        2022.03: 15&#39;012 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (nur für von Topos ausgewählte Arten, inklusive von den
        Art-Verantwortlichen neu erfasste)
      </li>
      <li>
        2022.04: 1&#39;147 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (von den Art-Verantwortlichen neu erfasste ausserhalb des von der
        Infoflora mit normalen Exporten gelieferten Gebiets, d.h. mehr als 30km
        vom Kt. Zürich entfernt)
      </li>
      <li>
        2022.08: 208 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
      </li>
      <li>
        2022.12: 3&#39;029 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (Gesamt-Auszug für die AP-Arten)
      </li>
      <li>
        2022.12: 16 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (Von den AV&apos;s neu erfasste Beobachtungen, die nicht im vorigen
        Gesamt-Auszug enthalten waren)
      </li>
      <li>
        2023.02: 215 von{' '}
        <a
          href="https://www.infoflora.ch/de/allgemeines/info-species.html"
          target="_blank"
          rel="noreferrer"
        >
          Info Spezies
        </a>{' '}
        (Von den AV&apos;s erfasste Beobachtungen von Utricularia)
      </li>
    </ul>
  </>
)

export default BeobZuordnen
