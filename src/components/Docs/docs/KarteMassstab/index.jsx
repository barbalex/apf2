import { DokuDate } from '../..'
import mapMeasure from './mapMeasure.png'
import mapScale from './mapScale.png'
import mapScaleOpen from './mapScaleOpen.png'
import mapScaleSet from './mapScaleSet.png'

const KarteMassstab = () => (
  <>
    <h1>Karte: Massstab</h1>
    <DokuDate>18.04.2019</DokuDate>
    <p>Wurde am 14.09.2018 eingeführt.</p>
    <p>
      Ihr findet das Massstab-Werkzeug unten links auf der Karte, oberhalb des
      Werkzeugs, dass eine Distanz anzeigt:
      <br />
      <img src={mapScale} alt="Massstab-Werkzeug" />
      <br />
    </p>
    <p>Was kann es?</p>
    <ul>
      <li>
        Es zeigt immer den ungefähren aktuellen Massstab der Karte an
        <br />
        Wieso ungefähr?
        <ul>
          <li>
            Es wird der nächste Massstab aus der Auswahlliste angezeigt (siehe
            unten)
          </li>
          <li>
            Weil der Massstab von sehr vielen Faktoren abhängt (u.a. Tile-Grösse
            der Hintergrundkarte, geographische Höhe, Bildschirm-Auflösung...)
            ist er grundsätzlich nicht sehr genau.
          </li>
          <li>
            Plane Kartendarstellungen können grundsätzlich nicht überall
            denselben Massstab darstellen. Versucht mal, einen aufblasbaren
            Globus aufzuschneiden und flach auszubreiten 😜.
            <br />
            Wenn ihr also eine Distanz messen wollt, benutzt dafür das
            Mess-Werkzeug oben rechts unter dem Layer-Werkzeug:
            <br />
            <img src={mapMeasure} alt="Messen" />
          </li>
        </ul>
      </li>
      <li>
        Klickt man auf das Massstab-Werkzeug, öffnet sich eine Liste von
        Massstäben, aus denen man wählen kann
        <br />
        <img src={mapScaleOpen} alt="Massstab wählen" />
      </li>
      <li>
        ...und im untersten Feld kann man einen beliebigen Massstab setzen
        <br />
        <img src={mapScaleSet} alt="Massstab setzen" />
      </li>
    </ul>
  </>
)

export default KarteMassstab
