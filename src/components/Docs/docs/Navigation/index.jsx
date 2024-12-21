import { memo } from 'react'
import { DokuDate, Code } from '../../DesktopDocs.jsx'

export const Component = memo(() => (
  <>
    <h1>Navigation</h1>
    <DokuDate>20.12.2024</DokuDate>
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
    <br />
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
    <p>
      In der Mobil-Ansicht wird grundsätzlich immer nur eine Oberfläche
      angezeigt. Mehr (z.B. Navigationsbaum neben Formular) ist nur in der
      Desktop-Ansicht möglich.
    </p>
    <p>
      Der Navigationsbaum enthält Kontext-Menüs. Diese sind auf primär
      Finger-Gesteuerten Geräten deaktiviert, weil sie sich nicht für die
      Bedienung mit Fingern eignen und die Gefahr besteht, sie ungewollt zu
      aktivieren (v.a. bei Nässe). Neu gibt es Menüs in den Formularköpfen, die
      sich dynamisch an die verfügbare Breite anpassen (sie sind auch auf dem
      Desktop verfügbar).
    </p>
    <p>
      Mobile und Desktop sind nicht immer klar zu bestimmen. Es gibt sehr grosse
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
    <br />
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
      <li>Strukturbaum 2, Daten 2, Filter 2</li>
    </ul>
  </>
))
