import image001 from './image001.png'
import image002 from './image002.png'
import image003 from './image003.png'
import image004 from './image004.png'
import image005 from './image005.png'

import desktopStyles from '../../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Navigation 📱💻</h1>
    <p className={desktopStyles.dokuDate}>20.12.2024</p>
    <p>
      Früher war apflora primär für die Arbeit auf Desktops ausgelegt. Ende 2024
      wurde apflora für die Bedienung auf Handys und Tablets erweitert.
    </p>
    <p>
      apflora hat eine tiefe hierarchische Struktur. Das macht die Navigation
      anspruchsvoll und eine gute Umsetzung wichtig. Darum gibt es eine&nbsp;
      <b>Mobil-Ansicht</b> und eine <b>Desktop-Ansicht</b> mit jeweils eigener
      Navigation:
    </p>
    <ul>
      <li>
        Auf dem Desktop ist der <b>Navigationsbaum</b>&nbsp;das Werkzeug der
        Wahl.
      </li>
      <li>
        Auf Mobilgeräten gibt es <b>Bookmarks</b> und&nbsp;
        <b>Navigationslisten</b>.
      </li>
    </ul>
    <h2>Navigieren und Arbeiten in der mobilen Version</h2>
    <p>
      In der Mobil-Ansicht wird grundsätzlich immer nur eine Oberfläche
      angezeigt. Mehr (z.B. Navigationsbaum neben Formular) ist nur in der
      Desktop-Ansicht möglich.
    </p>
    <p>
      Der Navigationsbaum enthält Kontext-Menüs. Diese sind auf primär
      Finger-gesteuerten Geräten deaktiviert, weil die Knoten des
      Navigationsbaums zu klein sind und bei den Kontextmenüs die Gefahr
      besteht, sie ungewollt zu aktivieren, v.a. bei Nässe. Neu gibt es Menüs in
      den Formularköpfen, die sich dynamisch an die verfügbare Breite anpassen.
    </p>
    <img
      src={image001}
      alt="UI-Elemente"
    />
    <p>
      In der Mobil-Ansicht wird einem angezeigt, was die verschiedenen Menüs
      auslösen, wenn man lange darauf drückt:
    </p>
    <img
      src={image002}
      alt="Tooltip"
    />
    <h2>Wechsel zwischen Mobile und Desktop-Version</h2>
    <p>
      Mobile und Desktop sind nicht immer klar abzugrenzen. Es gibt sehr grosse
      Bildschirme mit Touch-Steuerung. Einige Bildschirme mit Touch-Steuerung
      werden primär mit der Maus bedient. Handys wiederum können z.T. sehr hohe
      Auflösung haben.
    </p>
    <p>
      Aktuell ist die Grenze zwischen Mobil- und Desktop-Navigation in apflora
      bei einer Bildschirmbreite von 1000 Pixeln festgelegt. Wegen der unklaren
      Grenze zwischen Mobile und Desktop gibt es im Mehr-Menü die folgenden
      Optionen:
    </p>
    <ul>
      <li>
        Der Navigationsbaum kann auch auf Mobilgeräten angeboten werden. Man
        kann dann mit dem Top-Menü seine Anzeige steuern.
      </li>
      <li>Die Mobil-Navigation kann erzwungen werden.</li>
      <li>
        Die Desktop-Navigation kann erzwungen werden. In diesem Fall können auch
        auf kleinen Bildschirmen mehrere Oberflächen nebeneinander angezeigt
        werden.
      </li>
    </ul>
    <img
      src={image003}
      alt="Menüs"
    />
    <p>
      Die bisherigen Tabs (z.B. Auswertung, Dateien, Biotop, Historien) wurden
      bei der Implementation der Mobil-Navigation in die normale Navigation
      (Navigationsbaum bzw. Bookmarks & Navigationslisten) gezügelt.
    </p>
    <p>
      Die folgenden Oberflächen bleiben dem Desktop vorbehalten, weil sie auf
      kleinen Bildschirmen keinen Sinn machen:
    </p>
    <ul>
      <li>EK-Planung</li>
      <li>Navigationsbaum 2, Daten 2, Filter 2</li>
    </ul>
    <h2>Änderungen der Anzeige im Strukturbaum und der Navigationsliste</h2>
    <p>
      Die bisherigen Tabs (z.B. Auswertung, Dateien, Biotop, Historien) wurden
      bei der Implementation der Mobil-Navigation in die normale Navigation
      (Navigationsbaum bzw. Bookmarks & Navigationslisten) gezügelt.
    </p>
    <p>
      Es wird neu nicht nur angezeigt, wieviele z.B. Teilpopulationen eine
      Population hat, sondern auch, wieviele davon gerade angezeigt werden (z.B.
      2/4). Dies ist vor allem nützlich um zu sehen, ob noch ein Filter aktiv
      ist.
    </p>
    <img
      src={image004}
      alt="Ehemalige Tabs"
      width={558}
    />
    <img
      src={image005}
      alt="Ehemalige Tabs"
    />
  </>
)
