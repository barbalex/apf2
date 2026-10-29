import { Link } from 'react-router'
import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Daten sichern 🔒</h1>
    <p className={desktopStyles.dokuDate}>24.10.2026</p>
    <p>
      Täglich nach Mitternacht wird von der Datenbank ein SQL-Dumpfile erstellt
      und in eine Nextcloud übermittelt. Diese wird auf Festplatten und
      verschlüsselt in einer weiteren Cloud gesichert.
    </p>
    <p>Alle paar Tage wird der gesammte virtuelle Server gesichert.</p>
    <p>
      Sporadisch wird die Datenbank auf Entwicklungs-PC&#39;s aus einer
      Sicherung neu hergestellt{' '}
      <Link to="/Dokumentation/daten-wiederherstellen">(Anleitung)</Link>. Das
      dient einerseits dem Unterhalt der Anwendung: Entwickelt wird auf einer
      lokalen Kopie. Gleichzeitig werden so Sicherung und Wiederherstellung
      getestet.
    </p>
  </>
)
