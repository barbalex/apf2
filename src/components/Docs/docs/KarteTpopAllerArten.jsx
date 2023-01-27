import { DokuDate } from '..'

const KarteTpopAllerArten = () => (
  <>
    <h1>Karte: (Teil-)Populationen aller Arten anzeigen</h1>
    <DokuDate>20.05.2020</DokuDate>
    <p>Bedingungen:</p>
    <ul>
      <li>Strukturbaum ist offen</li>
      <li>
        Im Strukturbaum ist das Projekt oder der Art-Ordner aktiv.
        <br />
        Ist eine Art oder tieferer Knoten aktiv, wird nur die betreffende Art
        angezeigt
      </li>
      <li>Die Karte ist offen</li>
      <li>In der Karte ist das (Teil-)Populationen-Layer aktiv</li>
      <li>
        Bei Teil-Populationen: Die Karte ist auf einen kleinen Ausschnitt
        gezoomt.
        <br />
        Sonst gibt es mehr Teil-Populationen, als angezeigt werden können (die
        Grenze wurde bei 2&#39;000 Teilpopulationen gesetzt).
        <br />
        Ist der Ausschnitt zu gross, erscheint eine entsprechende Meldung
      </li>
      <li>
        Sobald der Ausschnitt ändert (Zoomen oder Verschieben), werden die Daten
        automatisch neu geladen
      </li>
    </ul>
    <p>Wurde am 11.12.2018 eingeführt. Und am 20.5.2020 verbessert.</p>
  </>
)

export default KarteTpopAllerArten
