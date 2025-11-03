import { dokuDate } from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Karte: (Teil-)Populationen aller Arten anzeigen</h1>
    <p className={dokuDate}>20.12.2024</p>
    <p>Bedingungen:</p>
    <ul>
      <li>Navigationsbaum ist offen</li>
      <li>
        Im Navigationsbaum ist das Projekt oder der Art-Ordner aktiv.
        <br />
        Ist eine Art oder tieferer Knoten aktiv, wird nur die betreffende Art
        angezeigt
      </li>
      <li>Die Karte ist offen</li>
      <li>In der Karte ist das (Teil-)Populationen-Layer aktiv</li>
    </ul>
    <p>
      Ist keine Art aktiv, werden die (Teil-)Populationen aller Arten geladen.
      Das können über 30'000 Objekte sein! Meldungen warnen vor den möglichen
      Folgen. Damit die Daten geladen werden, muss die entsprechende Option im
      Layertool explizit gewählt werden. Ist also selber schuld, wer sein Gerät
      überfordert... (allerdings funktioniert es auf meinen leistungstarken
      Entwicklungs-PC einwandfrei)
    </p>
    <p>Wurde am 11.12.2018 eingeführt. Und am 20.5.2020 verbessert.</p>
  </>
)
