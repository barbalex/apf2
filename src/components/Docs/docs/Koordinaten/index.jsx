import { DokuDate } from '../..'
import coordinates from './coordinates.png'

const Koordinaten = () => (
  <>
    <h1>Koordinaten</h1>
    <DokuDate>02.06.2019</DokuDate>
    <p>
      Früher wurden Koordinaten in apflora in der Projektion{' '}
      <a
        href="https://www.swisstopo.admin.ch/de/wissen-fakten/geodaesie-vermessung/bezugsrahmen/lokal/lv03.html"
        target="_blank"
        rel="noreferrer"
      >
        LV03
      </a>{' '}
      erfasst. ca. Anfang 2018 wurde{' '}
      <a
        href="https://www.swisstopo.admin.ch/de/wissen-fakten/geodaesie-vermessung/bezugsrahmen/lokal/lv95.html"
        target="_blank"
        rel="noreferrer"
      >
        LV95
      </a>{' '}
      übernommen.
    </p>
    <p>
      Leider mussten wir feststellen, dass LV95 ausserhalb der Schweiz einen
      deutlich schmaleren Bereich abdeckt als zuvor LV03. So konnten schon im
      nahen Deutschland die Koordinaten einiger Teil-Populationen nicht mehr
      gespeichert werden.
    </p>
    <p>
      Darum haben wir am 2.6.2019 auf eine Projektion gewechselt, die weltweit
      angewandt wird:{' '}
      <a
        href="https://de.wikipedia.org/wiki/World_Geodetic_System_1984"
        target="_blank"
        rel="noreferrer"
      >
        WGS84
      </a>{' '}
      (Längen- und Breitengrade). Und dazu verwenden wir{' '}
      <a
        href="https://de.wikipedia.org/wiki/PostGIS"
        target="_blank"
        rel="noreferrer"
      >
        PostGIS
      </a>
      . Somit sind die GIS-Funktionalitäten von apflora künftig stark ausbaubar.
    </p>
    <p>
      In Formularen (Populationen und Teil-Populationen) werden neu beide
      Projektionen dargestellt:
      <br />
      <img src={coordinates} alt="Koordinaten-Felder" />
      <br />
      ...und die Daten können auch in beiden verändert werden.
    </p>
    <p>
      Bisher ist mir noch keine Karte begegnet, welche den Gültigkeitsbereich
      von LV95 im Ausland klar abgrenzt. Das ist wohl bewusst so, weil LV95 nur
      für die Schweiz gedacht ist.{' '}
      <strong>
        Im Ausland sollte daher künftig grundsätzlich WGS84 verwendet werden
      </strong>
      .
    </p>
  </>
)

export default Koordinaten
