import { DokuDate } from '../../DesktopDocs.jsx'

export const Component = () => (
  <>
    <h1>Dateien anfügen 📸</h1>
    <DokuDate>21.12.2024</DokuDate>
    <p>Wurde am 27.05.2019 eingeführt.</p>
    <p>
      Dateien können <strong>in folgenden Formularen</strong> angefügt werden:
    </p>
    <ul>
      <li>Art</li>
      <li>Population</li>
      <li>Teil-Population</li>
      <li>Massnahme</li>
      <li>Idealbiotop</li>
      <li>Feld-Kontrolle</li>
      <li>Freiwilligen-Kontrolle</li>
    </ul>
    <p>
      <strong>Zweck</strong>: Dokumentation gemäss Vorgaben von Topos. Daher
      gibt es ein Feld, um die Datei zu beschreiben.
    </p>
    <p>
      Viele Dateitypen können in einer Vorschau-Ansicht angezeigt werden. Die
      Vorschau kann auf die Bildschirmgrösse maximiert werden.
    </p>
    <p>
      Dateien könnt ihr auch <strong>herunterladen</strong>.
    </p>
    <p>
      <strong>Bitte mit Bedacht nutzen</strong>:
    </p>
    <ul>
      <li>Möglichst nur hochladen, was nützlich ist</li>
      <li>Speicherplatz hat seinen Preis</li>
      <li>Grössere Bilder werden beim Upload auf 2056*2056 Pixel reduziert</li>
      <li>Maximale Datei-Grösse ist 100MB</li>
    </ul>
  </>
)
