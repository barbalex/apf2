import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Big apflora is watching you 😉</h1>
    <p className={desktopStyles.dokuDate}>24.06.2022</p>
    <p>Wurde am 8.7.2019 eingeführt.</p>
    <p>
      Wenn ihr arbeitet, speichert apflora den aktuellen Zustand. Zum Beispiel:
    </p>
    <ul>
      <li>welches Formular offen ist</li>
      <li>welche Arten ihr im EK-Plan bearbeitet</li>
      <li>welche Layer ihr auf der Karte anzeigt</li>
    </ul>
    <p>
      Neu gilt: Wenn ihr apflora öffnet, erinnert sich apflora an den letzten
      Zustand.
    </p>
    <p>
      Das heisst: apflora liest den letzten Zustand von eurer Festplatte aus,
      springt dann zum letzten Formular, in dem ihr gearbeitet habt und sollte
      alles genau gleich anzeigen, wie beim letzten Mal.
    </p>
    <p>
      Es gibt auch einen neuen Befehl im Mehr-Menü, mit dem ihr apflora sagen
      könnt: &quot;Vergiss bitte den aktuellen Zustand&quot;. Er heisst:
      &quot;abmelden&quot;. Hoffentlich braucht ihr diesen Befehl nie. Aber: Das
      Erinnern früherer Zustände birgt auch die Gefahr, sich an Zustände zu
      erinnern, die Fehler enthalten und daher das Arbeiten stören 😝
    </p>
    <p>&nbsp;</p>
  </>
)
