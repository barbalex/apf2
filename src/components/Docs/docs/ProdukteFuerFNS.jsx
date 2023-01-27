import { DokuDate } from '..'

const ProdukteFuerFNS = () => (
  <>
    <h1>Produkte für die Fachstelle Naturschutz</h1>
    <DokuDate>1.1.2023</DokuDate>
    <p>Die FNS erhält aus apflora folgende Produkte:</p>
    <ul>
      <li>Den Jahresbericht (pdf oder Ausdruck)</li>
      <li>
        Artbeobachtungen
        <br />
        Dazu werden die Feld- und Freiwilligenkontrollen (ausser solche von
        soeben angesäten, noch nicht etablierten Teilpopulationen) exportiert.
        Siehe <a href="../info-flora-export">Info-Flora-Export</a>
      </li>
      <li>
        Teilpopulationen, Kontrollen und Massnahmen für die Anzeige in GIS und{' '}
        <a
          href="https://aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/web_gis.html"
          target="_blank"
          rel="noreferrer"
        >
          Web-GIS BUN
        </a>
      </li>
    </ul>
  </>
)

export default ProdukteFuerFNS
