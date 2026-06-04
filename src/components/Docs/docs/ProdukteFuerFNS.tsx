import { Link } from 'react-router'
import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Produkte für die Fachstelle Naturschutz 🛒</h1>
    <p className={desktopStyles.dokuDate}>1.1.2023</p>
    <p>Die FNS erhält aus apflora folgende Produkte:</p>
    <ul>
      <li>Den Jahresbericht (pdf oder Ausdruck)</li>
      <li>
        Artbeobachtungen
        <br />
        Dazu werden die Feld- und Freiwilligenkontrollen (ausser solche von
        soeben angesäten, noch nicht etablierten Teilpopulationen) exportiert.
        Siehe{' '}
        <Link to="/Dokumentation/info-flora-export">Info-Flora-Export</Link>
      </li>
      <li>
        Teilpopulationen, Kontrollen und Massnahmen für die Anzeige in GIS
      </li>
    </ul>
  </>
)
