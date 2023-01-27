import { DokuDate } from '../..'
import field from './field.png'

const Markdown = () => (
  <>
    <h1>Formatierbare Felder</h1>
    <DokuDate>04.05.2020</DokuDate>
    <p>
      Am 19.04.2020 wurden formatierbare Felder eingeführt:
      <br />
      <img src={field} alt="Filter öffnen" />
    </p>
    <p>Dafür wird ein sogenannter &quot;markdown editor&quot; verwendet.</p>
    <p>
      In Markdown-Feldern seht ihr nun ein Menüband am oberen Rand des Feldes.
      Links sind die Formatierungs-Möglichkeiten. Rechts zwei Schaltflächen:
    </p>
    <ol>
      <li>
        Die linke wechselt von Editiermodus zum parallelen Editieren mit
        Vorschau, zur reinen Vorschau und dann wieder in den reinen
        Editiermodus. Das ist ein bisschen gewöhnungsbedürftig 😜
      </li>
      <li>
        Die rechte ermöglicht euch, beim Schreiben den ganzen Bildschirm zu
        nutzen
      </li>
    </ol>
    <p>
      Markdown ist ein reines Text-Format. Daher kann es roh in ein Textfeld
      einer Datenbank gespeichert werden. Die Daten können sogar weiterhin
      abfragt bzw. gesucht werden.
    </p>
    <p>
      Der Hauptgrund, warum einige Felder Markdown zulassen, ist Zeilen-Umbrüche
      und Leer-Zeilen zu ermöglichen.
    </p>
  </>
)

export default Markdown
