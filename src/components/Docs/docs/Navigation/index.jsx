import { memo } from 'react'
import { DokuDate, Code } from '../../DesktopDocs.jsx'

export const Component = memo(() => (
  <>
    <h1>Navigation</h1>
    <DokuDate>20.12.2024</DokuDate>
    <h2>1. Mobil vs. Desktop</h2>
    <p>
      Bis Ende 2024 war apflora v.a. für die Arbeit auf Desktops ausgelegt. Ende
      2024 wurde es für die Arbeit auf Handys und Tablets erweitert.
    </p>
    <p>
      apflora hat eine tiefe, hierarchische Struktur. Das macht die Navigation
      anspruchsvoll und eine gute Umsetzung wichtig. Darum gibt es eine&nbsp;
      <b>Mobil-Ansicht</b> und eine <b>Desktop-Ansicht</b> mit jeweils eigener
      Navigation.
    </p>
    <p>
      Auf dem Desktop ist der <b>Navigationsbaum</b>&nbsp; das Werkzeug der
      Wahl.
    </p>
    <p>
      Auf Mobilgeräten gibt es <b>Bookmarks</b> und&nbsp;
      <b>Navigationslisten</b>. In den Bookmarks können auch Menüs eingeblendet
      werden (Option im Mehr-Menü).
    </p>
    <p>
      Der Navigationsbaum enthält Kontext-Menüs. Diese sind in der Mobil-Ansicht
      deaktiviert, weil sie sich nicht für die Bedienung mit Fingern eignen.
      Stattdessen gibt es Menüs in den Formularköpfen, die sich dynamisch an die
      verfügbare Breite anpassen (sie sind auch auf dem Desktop verfügbar).
    </p>
    <p>
      Der Navigationsbaum <em>kann</em> auch auf Mobilgeräten eingeblendet
      werden. Auf dem Desktop <em>kann</em> die Mobil-Navigation erzwungen
      werden (Optionen im Mehr-Menü).
    </p>
    <p>
      Was ein Mobilgerät ist, ist leider nicht endgültig und zufriedenstellend
      definierbar. Es gibt sehr grosse Bildschirme mit Touch-Steuerung. Es gibt
      Bildschirme mit Touch-Steuerung, die primär mit der Maus bedient werden.
      Handys wiederum können z.T. sehr hohe Auflösung haben. Aktuell ist die
      Grenze zwischen Mobil- und Desktop-Navigation in apflora bei einer
      Bildschirmbreite von 1000 Pixeln festgelegt.
    </p>
    Ich habe selber kein Tablet. Bin froh um Rückmeldungen falls die aktuelle
    Einstellung dort nicht optimal sein sollte. Seit unserer Besprechung wurde
    implementiert: - In der Mobilansicht sind die Kontextmenüs im
    Navigationsbaum deaktiviert. - Navigationslisten werden mobil auch bei
    einzelnen Objekten (Art, Projekt, Teilprojekt, Feldkontrolle) anstelle des
    Daten-Formulars angezeigt. Um ins Objekt zu gelangen gibt es einen
    entsprechenden Eintrag in der Liste. Wenn man nicht mehr tiefer navigieren
    kann, wird direkt das Daten-Formular geöffnet. - Die Navigation von zuoberst
    in der Hierarchie überspringt in der Mobilansicht die Projekt-Liste, da es
    nur ein Projekt gibt. - Die bisherigen Tabs wurden in die normale Navigation
    (Navigationsbaum, Bookmarks & Navigationslisten) gezügelt (Desktop und
    mobil). - In der Desktopansicht werden (wieder) grundsätzlich nur
    Daten-Formulare angezeigt. - Bei den Bookmarks scheinen mir die Befehle an
    deren rechten Rand wenig(er) nützlich, da jetzt immer Navigationslisten zur
    Verfügung stehen. Ich habe sie ausbeglendet (Vorteile: übersichtlicher, mehr
    Platz für den Text). In den Optionen gibt es einen Befehl, um sie
    einzublenden. Sagt mir doch bitte, ob ihr meint, sie seien noch nötig.
  </>
))
