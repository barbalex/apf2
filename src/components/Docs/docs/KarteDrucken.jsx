import { DokuDate } from '..'

const KarteDrucken = () => (
  <>
    <h1>Karte: Drucken</h1>
    <DokuDate>14.09.2019</DokuDate>
    <p>Auf der Karte gibt es zwei Schaltflächen, um:</p>
    <ol>
      <li>Die Karte als png-Datei zu speichern</li>
      <li>
        Die Karte zu drucken, in diesen Formaten:
        <ul>
          <li>in der aktuellen Grösse</li>
          <li>A4 hoch</li>
          <li>A4 quer</li>
        </ul>
      </li>
    </ol>
    <p>
      Leider gibt es beim Druck gelegentlich <strong>Probleme</strong> (Stand
      14.9.2019):
    </p>
    <p>
      Die Hintergrund-Layer der Swisstopo können nicht immer gedruckt werden.
      Die Server der Swisstopo senden nicht immer einen sogenannten
      &quot;cors-header&quot;. Fehlt dieser, scheitert der Druck. Schlimmer: Der
      Code von apflora hat keine Möglichkeit, das zu merken (es passiert
      innerhalb des verwendeten Druck-Werkzeugs). Und weil während des Drucks
      die Menüs auf der Karte ausgeblendet werden, erscheinen sie nach
      gescheitertem Druck nicht mehr 😜
    </p>
    <p>
      Damit sie wieder erscheinen, müsst ihr apflora dazu bringen, die Karte neu
      aufzubauen. Das macht ihr, indem ihr sie aus- und wieder einblendet.
    </p>
  </>
)

export default KarteDrucken
