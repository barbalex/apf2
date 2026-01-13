import { Link } from 'react-router'

import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Tipps für den Einstieg</h1>
    <p className={desktopStyles.dokuDate}>20.12.2024</p>
    <ul>
      <li>
        Die <strong>Anwendung</strong> ist hier:{' '}
        <Link to="/Daten">https://apflora.ch/Daten</Link>
      </li>
      <li>
        Ihr braucht ein <strong>Login</strong>. Das wird von Topos vergeben,
        z.B. von <a href="mailto:kurz@toposmm.ch">Rebecca Kurz</a>
      </li>
      <li>
        Nach erfolgreichem Login wählt ihr die <strong>Art</strong>, mit dem ihr
        arbeiten wollt.
      </li>
      <li>
        Die <strong>Menübefehle</strong> erscheinen, wenn ihr mit der rechten
        Maustaste im Navigationsbaum auf ein Objekt (z.B. eine Population)
        klickt. Auf Mobilgeräten navigiert ihr mit Bookmarks und
        Navigationslisten (
        <Link to="/Dokumentation/Navigation">siehe Navigation</Link>)
      </li>
      <li>
        Ein Teil der <strong>Objekte können verschoben werden</strong>:
        Populationen, Teil-Populationen, Massnahmen, Feldkontrollen und
        Freiwilligen-Kontrollen. Das macht ihr mittels
        &quot;ausschneiden&quot;/&quot;kopieren&quot; und anschliessendem
        &quot;einfügen&quot; mit dem Menu
      </li>
      <li>
        Um wiederholtes Kopieren / Verschieben effizienter zu gestalten,{' '}
        <strong>
          kann man einen zweiten Satz von Navigationsbaum und Daten öffnen
        </strong>
      </li>
      <li>
        Abies alba ist <strong>Testart</strong>. Hier könnt ihr alles
        ausprobieren, was euch (noch) nicht geheuer ist. Damit man auch üben
        kann, Populationen zu verschieben, ist auch Abutilon theophrasti Testart
      </li>
    </ul>
    <p>&nbsp;</p>
  </>
)
