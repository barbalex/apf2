import { DokuDate } from '..'

const TechnischeVoraussetzungen = () => (
  <>
    <h1>Technische Voraussetzungen</h1>
    <DokuDate>29.04.2020</DokuDate>
    <p>
      Vorausgesetzt wird ein <strong>moderner Browser</strong>:
    </p>
    <ul>
      <li>
        Empfehlenswert ist Google Chrome oder Microsoft Edge (modern) -
        apflora.ch wird auf Chrome entwickelt.
        <br />
        Meines Wissens funktionieren gewisse Ausdrucke nur auf Google Chrome und
        Microsoft Edge (modern) richtig.
        <br />
        Alles Andere sollte prinzipiell auch auf allen anderen modernen Browsern
        funktionieren.
      </li>
      <li>Firefox wird regelmässig produktiv benutzt</li>
      <li>Safari auf Mac OsX scheint zu funktionieren</li>
      <li>apflora.ch funktioniert auf dem Internet Explorer nicht</li>
      <li>
        Wer keinen modernen Browser einsetzen darf (wie z.B. die Fachstelle
        Naturschutz Kt. Zürich) oder aus einem anderen Grund lieber will, kann{' '}
        <a
          href="https://www.dropbox.com/sh/5ar4f0fu5uqvhar/AADJmUo_9pakOnjL_U27EpQMa?dl=0"
          target="_blank"
          rel="noreferrer"
        >
          hier
        </a>{' '}
        eine lokal installierbare Version beziehen. Für die Installation auf
        Windows den aktuellsten <code>apflora-win32-x64</code>-Ordner in den
        eigenen Benutzer-Ordner kopieren (oder irgendwo sonst, wo Sie über die
        Rechte verfügen, eine .exe-Datei auszuführen). Dann die darin enthaltene{' '}
        <code>apflora.exe</code> starten
      </li>
    </ul>
    <p>&nbsp;</p>
  </>
)

export default TechnischeVoraussetzungen
