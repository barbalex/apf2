import { DokuDate } from '../..'
import tpopSymbols1 from './tpopSymbols1.png'
import tpopSymbols2 from './tpopSymbols2.png'
import tpopSymbols3 from './tpopSymbols3.png'

const KartePopTpopIconsLabelWaehlen = () => (
  <>
    <h1>Karte: Symbole und Label für (Teil-)Populationen wählen</h1>
    <DokuDate>30.01.2019</DokuDate>Seit dem 26.12.2018 ist das Blumen-Symbol für
    Populationen und Teil-Populationen im Layer-Tool der Karte interaktiv:
    <br />
    <img src={tpopSymbols1} alt="Symbol im Layertool" />
    <br />
    <br />
    Klickt man darauf, öffnet sich ein Menü:
    <br />
    <img src={tpopSymbols2} alt="Menü" />
    <br />
    <br />
    Darin kann man wählen, mit welcher Symbolisierung und Labels Populationen
    und Teil-Populationen angezeigt werden. Aktuell stehen zur Verfügung:
    <br />
    <br />
    <h3> Symbole:</h3>
    <ul>
      <li>alle Populationen/Teil-Populationen gleich (wie bisher)</li>
      <li>
        Populationen/Teil-Populationen nach Statusgruppen unterschieden:
        <ul>
          <li>ursprünglich: U</li>
          <li>angesät: A</li>
          <li>potentiell: P</li>
          <li>ohne Status: ?</li>
        </ul>
      </li>
    </ul>
    <img src={tpopSymbols3} alt="Neue Symbole" />
    <br />
    <h3>Label:</h3>
    <ul>
      <li>Nr. (Populationen) bzw. Pop-Nr./Tpop-Nr. (Teil-Populationen)</li>
      <li>Name (Populationen) bzw. Flurname (Teil-Populationen)</li>
    </ul>
    <br />
  </>
)

export default KartePopTpopIconsLabelWaehlen
