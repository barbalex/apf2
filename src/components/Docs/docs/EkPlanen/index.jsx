import { DokuDate } from '../..'
import ekplanFilternJahr from './ekplan_filtern_jahr.gif'
import ekplanenAp from './ekplanen_ap.png'
import ekplanenAuto from './ekplanen_auto.gif'
import ekplanenBlitzMultiple from './ekplanen_blitz_multiple.png'
import ekplanenBlitzZaehlung from './ekplanen_blitz_zaehlung.png'
import ekplanenBlitz from './ekplanen_blitz.png'
import ekplanenForm1 from './ekplanen_form_1.png'
import ekplanenForm2 from './ekplanen_form_2.png'
import ekplanenForm3 from './ekplanen_form_3.png'
import ekplanenFrequenzFiltern from './ekplanen_frequenz_filtern.gif'
import ekplanenGlobal from './ekplanen_global.png'
import ekplanenHakenMultiple from './ekplanen_haken_multiple.png'
import ekplanenHakenZaehlung from './ekplanen_haken_zaehlung.png'
import ekplanenHaken from './ekplanen_haken.png'
import ekplanenInfos from './ekplanen_infos.png'
import ekplanenManuell from './ekplanen_manuell.png'
import ekplanenPlanHaken from './ekplanen_plan_haken.png'
import ekplanenPlan from './ekplanen_plan.png'
import ekplanenSpalten from './ekplanen_spalten.png'
import filtern from './filtern.gif'

const EkPlanen = () => (
  <>
    <h1>Erfolgs-Kontrollen planen</h1>
    <DokuDate>10.09.2019</DokuDate>
    <p>
      <strong>Inhalt</strong>
    </p>
    <ol>
      <li>
        <p>
          <a href="#ziele">Ziele</a>
        </p>
      </li>
      <li>
        <p>
          <a href="#diese-daten-werden-erfasst">Diese Daten werden erfasst</a>
        </p>
        <ul>
          <li>
            <a href="#global">Global</a>
          </li>
          <li>
            <a href="#pro-art">Pro Art</a>
          </li>
          <li>
            <a href="#pro-teilpopulation">Pro Teilpopulation</a>
          </li>
        </ul>
      </li>
      <li>
        <p>
          <a href="#3-formular-ek-planung">Formular EK-Planung</a>
        </p>
        <ul>
          <li>
            <a href="#arten-wählen">Arten wählen</a>
          </li>
          <li>
            <a href="#dargestellte-informationen-wählen">
              Dargestellte Informationen wählen
            </a>
          </li>
          <li>
            <a href="#kontrollen-planen">Kontrollen planen</a>
          </li>
          <li>
            <a href="#mehr-informationen">Mehr Informationen</a>
          </li>
          <li>
            <a href="#filter-setzen">Filter setzen</a>
          </li>
        </ul>
      </li>
    </ol>
    <br />
    <h2 id="ziele">1. Ziele</h2>
    <p>
      Erfolgskontrollen sind gleichzeitig wichtig und aufwändig. Im Jahr 2019
      wird die Verwaltung und Planung der eigentlichen Kontrollen in apflora
      weiter entwickelt. Ziele:
    </p>
    <ul>
      <li>
        <p>
          Die Durchführung von Erfolgskontrollen kann sorgfältig geplant werden
        </p>
      </li>
      <li>
        <p>Topos und Artverantwortliche erhalten eine gute Übersicht über:</p>
        <ul>
          <li>geplante EK und EKF</li>
          <li>durchgeführte EK und EKF</li>
          <li>Ansiedlungen</li>
        </ul>
      </li>
      <li>
        <p>
          Es wird sicher gestellt, dass für jede Art die zielrelevanten
          Einheiten gezählt und dokumentiert werden
        </p>
      </li>
    </ul>
    <h2 id="diese-daten-werden-erfasst">2. Diese Daten werden erfasst</h2>
    <h3 id="global">Global</h3>
    <p>Durch die Koordinationsstelle. Im Strukturbaum in den Werte-Listen.</p>
    <ul>
      <li>EK-Abrechnungstypen</li>
      <li>
        Zähleinheiten
        <br />
        <img
          src={ekplanenGlobal}
          referrerPolicy="no-referrer"
          alt="im Strukturbaum"
          width={400}
        />
      </li>
    </ul>
    <h3 id="pro-art">Pro Art</h3>
    <p>Durch Koordinationsstelle und Artverantwortliche.</p>
    <ul>
      <li>
        Welche Zähleinheiten sind zielrelevant und sollen daher immer erfasst
        werden
      </li>
      <li>
        Frequenzen, nach denen in dieser Art kontrolliert werden soll. Inklusive
        Abrechnungstyp (EK-Frequenzen)
        <img
          src={ekplanenAp}
          referrerPolicy="no-referrer"
          alt="im Strukturbaum"
        />
      </li>
    </ul>
    <h3 id="pro-teilpopulation">Pro Teilpopulation</h3>
    <p>Durch Artverantwortliche.</p>
    <ul>
      <li>
        Aus den für die Art bestimmten Frequenzen wird die für diese
        Teil-Population passende gewählt
      </li>
      <li>
        Weicht die EK-Frequenz von der auf Art-Ebene für diesen Fall bestimmten
        Wert ab, wird das besonders markiert (&quot;EK-Frequenz
        abweichend&quot;)
      </li>
      <li>
        In welchen Jahren Kontrollen erfolgen sollen, differenziert nach EK und
        EKF
      </li>
    </ul>
    <p>
      Letzteres ist die eigentliche EK-Planung und sie geschieht primär im
      entsprechenden Formular:
    </p>
    <h2 id="3-formular-ek-planung">3. Formular EK-Planung</h2>
    <p>
      Das Formular ist für die Darstellung und Bearbeitung grosser Datenmengen
      konzipiert.
      <br />
      Je grösser und höher aufgelöst der Bildschirm, desto übersichtlicher kann
      man arbeiten. Auf kleinen Bildschirmen (z.B. Handy) ist es kaum brauchbar.
    </p>
    <h3 id="arten-wählen">Arten wählen</h3>
    <p>
      Oben links wählt man, von welchen Arten Teil-Populationen angezeigt werden
      sollen:
      <br />
      <img src={ekplanenForm2} referrerPolicy="no-referrer" alt="Formular" />
    </p>
    <p>
      Sobald eine Art gewählt wurde, erscheinen die zugehörigen
      Teil-Populationen in der Liste.
      <br />
      <img
        src={ekplanenForm1}
        referrerPolicy="no-referrer"
        alt="Formular"
        width="100%"
      />
      <br />
      Klickt man auf einen Spaltenkopf eines Felds, dass die Teil-Population
      beschreibt, erscheint eine Filter-Menu:
      <br />
      <img
        src={filtern}
        referrerPolicy="no-referrer"
        alt="Filtern"
        width="100%"
      />
    </p>
    <p>
      Rechts davon werden für Jahre Spalten aufgebaut:
      <br />
      <img
        src={ekplanenSpalten}
        referrerPolicy="no-referrer"
        alt="Spalten"
        width="100%"
      />
      <br />
      Je nachdem, welcher Wert oben rechts im Feld &quot;vergangene Jahre&quot;
      gewählt wurde (voreingestellt sind 5), werden die Jahre von diesem Wert
      bis 15 Jahre in die Zukunft angezeigt.
      <br />
      Auch wenn man für &quot;vergangene Jahre&quot; sehr hohe Werte wählt, wird
      frühestens mit dem ersten Jahr begonnen, in dem in einer der aufgelisteten
      Teil-Populationen eine Kontrolle stattfand.
    </p>
    <h3 id="dargestellte-informationen-wählen">
      Dargestellte Informationen wählen
    </h3>
    <p>
      Oben rechts wählt man, welche Informationen in den Teil-Populationen
      angezeigt werden:
      <br />
      <img
        src={ekplanenForm3}
        referrerPolicy="no-referrer"
        alt="Formular"
        width={400}
      />
    </p>
    <p>
      In den Zeilen für die Teilpopulationen werden in den Jahres-Spalten
      dargestellt:
    </p>
    <ul>
      <li>
        Grüne Haken symbolisieren ausgeführte Kontrollen{' '}
        <img src={ekplanenHaken} referrerPolicy="no-referrer" alt="Kontrolle" />
      </li>
      <li>
        Direkt rechts des Hakens stellt eine rote Zahl die Anzahl Kontrollen
        dar, wenn im selben Jahr mehrere Kontrollen stattfanden{' '}
        <img
          src={ekplanenHakenMultiple}
          referrerPolicy="no-referrer"
          alt="mehrere Kontrollen im selben Jahr"
        />
      </li>
      <li>
        Etwas weiter rechts neben dem Haken stellt eine schwarze Zahl die gemäss
        zielrelevanter Zähleinheit erfasste Anzahl dar, wenn diese Einheit
        gezählt wurde{' '}
        <img
          src={ekplanenHakenZaehlung}
          referrerPolicy="no-referrer"
          alt="Zählung"
        />
      </li>
      <li>
        Grüne Quadrate symbolisieren geplante Kontrollen{' '}
        <img
          src={ekplanenPlan}
          referrerPolicy="no-referrer"
          alt="geplante Kontrolle"
        />
      </li>
      <li>
        Fand eine Kontrolle im geplanten Jahr statt, sieht man im grünen Quadrat
        den grünen Haken{' '}
        <img
          src={ekplanenPlanHaken}
          referrerPolicy="no-referrer"
          alt="geplante Kontrolle fand statt"
        />
      </li>
      <li>
        Grüne Blitze symbolisieren Ansiedlungen{' '}
        <img
          src={ekplanenBlitz}
          referrerPolicy="no-referrer"
          alt="Ansiedlung"
        />
      </li>
      <li>
        Direkt rechts des Blitzes erscheint eine rote Zahl, wenn im selben Jahr
        mehrere Ansiedlungen stattfanden. Sie stellt die Anzahl Ansiedlungen dar{' '}
        <img
          src={ekplanenBlitzMultiple}
          referrerPolicy="no-referrer"
          alt="mehrere Ansiedlungen"
        />
      </li>
      <li>
        Etwas weiter rechts neben dem Blitz stellt eine schwarze Zahl die Anzahl
        Planzen und Triebe dar, falls erfasst{' '}
        <img
          src={ekplanenBlitzZaehlung}
          referrerPolicy="no-referrer"
          alt="Ansiedlung mit Zählung"
        />
      </li>
    </ul>
    <h3 id="kontrollen-planen">Kontrollen planen</h3>
    <h4>Automatisch</h4>
    <img
      src={ekplanenAuto}
      referrerPolicy="no-referrer"
      alt="Automatisch planen"
      width="100%"
    />
    <p>Ändert man die EK-Frequenz:</p>
    <ol>
      <li>
        Setzt apflora zunächst das Startjahr, beruhend auf der gewählten
        EK-Frequenz mit:
      </li>
    </ol>
    <ul>
      <li>EK-Typ (EK oder EKF)</li>
      <li>&quot;Kontrolljahre ab letzter&quot; (Kontrolle oder Ansiedlung)</li>
      <li>letzte Kontrolle oder Ansiedlung</li>
    </ul>
    <ol start="2">
      <li>Dann setzt apflora die EK-Pläne, beruhend auf</li>
    </ol>
    <ul>
      <li>Startjahr und</li>
      <li>Kontrolljahre gemäss EK-Frequenz</li>
    </ul>
    <p>
      Ändert man das Startjahr (und es gibt eine EK-Frequenz), setzt apflora die
      EK-Pläne.
    </p>
    <h4>Manuell</h4>
    <p>
      Wenn man eine Jahres-Zelle (Teilpopulation in Jahr) mit der Linken
      Maustaste anklickt, erscheint ein Menü. Hier wählt man den entsprechenden
      Eintrag:
      <br />
      <img
        src={ekplanenManuell}
        referrerPolicy="no-referrer"
        alt="Manuell planen"
      />
    </p>
    <h3 id="mehr-informationen">Mehr Informationen</h3>
    <p>
      Im gleichen Menü findet man weiterführende Infos zu EK, EKF und
      Ansiedlungen sowie Links um sie zu öffnen:
      <br />
      <img
        src={ekplanenInfos}
        referrerPolicy="no-referrer"
        alt="Infos zu Ereignissen"
      />
    </p>
    <h3 id="filter-setzen">Filter setzen</h3>
    <p>
      Bei den Feldern &quot;EK-Frequenz&quot; und &quot;EK-Frequenz
      Startjahr&quot; kann nach Nullwerten gefiltert werden:
      <br />
      <img
        src={ekplanenFrequenzFiltern}
        referrerPolicy="no-referrer"
        alt="Filtern"
        width="100%"
      />
    </p>
    <p>
      In den Jahres-Spalten kann nach dem Vorhandensein von Kontrollen,
      EK-Plänen und Ansiedlungen gefiltert werden:
      <br />
      <img
        src={ekplanFilternJahr}
        referrerPolicy="no-referrer"
        alt="Filtern"
        width="100%"
      />
    </p>
  </>
)

export default EkPlanen
