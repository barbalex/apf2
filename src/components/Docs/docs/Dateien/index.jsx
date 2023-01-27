import { DokuDate } from '../..'
import files01 from './files_01.png'
import files02Gallery from './files_02_gallery.png'
import files03Herunterladen from './files_03_herunterladen.png'
import files04Upload from './files_04_upload.png'

const Dateien = () => (
  <>
    <h1>Dateien anfügen</h1>
    <DokuDate>27.05.2019</DokuDate>
    <p>Wurde am 27.05.2019 eingeführt.</p>
    <p>
      Dateien können <strong>in folgenden Formularen</strong> angefügt werden:
    </p>
    <ul>
      <li>Idealbiotop: Im neuen Reiter &quot;Dateien&quot;</li>
      <li>Feld-Kontrolle: Im neuen Reiter &quot;Dateien&quot;</li>
      <li>
        Freiwilligen-Kontrolle: Im neuen Bereich &quot;Dateien&quot;. Er ist nur
        im Formular sichtbar, wird also nicht gedruckt.
      </li>
    </ul>
    <p>
      Beispiel Idealbiotop:
      <img src={files01} alt="Datein" width="100%" />
      <br />
    </p>
    <p>
      <strong>Zweck</strong>: Idealbiotope und Kontrollen gemäss Vorgaben von
      Topos dokumentieren. Daher gibt es ein Feld, um die Datei zu beschreiben.
    </p>
    <p>
      <strong>Hochladen</strong> könnt ihr aus folgenden Quellen:
    </p>
    <ul>
      <li>Lokal: Eine auf eurem PC gespeicherte Datei</li>
      <li>
        Kamera: Direkt von der Kamera (z.B. wenn ihr das direkt im Feld auf dem
        Smartphone macht)
      </li>
      <li>Web-Links</li>
      <li>Google Drive</li>
      <li>Google Photos</li>
      <li>Dropbox</li>
      <li>OneDrive</li>
      <li>box</li>
      <li>Instagram</li>
    </ul>
    <p>
      Hochladen-Dialog:
      <img src={files04Upload} alt="hochladen" width="100%" />
      <br />
    </p>
    <p>
      Meist dürfte es sich um Bilder handeln. Daher gibt es auch eine
      Möglichkeit, die Bilder inklusive Beschreibung in einer{' '}
      <strong>Gallerie-Ansicht</strong> zu öffnen:
      <img src={files02Gallery} alt="Gallerie-Ansicht" width="100%" />
      <br />
    </p>
    <p>
      Ihr könnt Dateien auch <strong>herunterladen</strong>:
      <img src={files03Herunterladen} alt="herunterladen" width="100%" />
      <br />
    </p>
    <p>
      <strong>Bitte mit Bedacht nutzen</strong>:
    </p>
    <ul>
      <li>Möglichst nur hochladen, was nützlich ist</li>
      <li>Speicherplatz hat seinen Preis</li>
      <li>
        Grössere Bilder werden daher beim Upload auf maximal 2056*2056 Pixel
        reduziert
      </li>
      <li>Maximale Datei-Grösse ist 100MB</li>
    </ul>
  </>
)

export default Dateien
