import desktopStyles from '../DesktopDocs.module.css'
import styles from './Testen.module.css'

export const Component = () => (
  <>
    <h1>Funktionalität testen</h1>
    <p className={desktopStyles.dokuDate}>18.04.2019</p>
    <p>
      Nachfolgend eine Liste der Funktionalitäten, die getestet werden sollen,
      wenn grössere Änderungen umgesetzt wurden.
    </p>
    <p>
      Die Menge von Funktionalitäten ist eindrücklich. Vor allem, wenn man
      bedenkt, dass z.B. für einem Punkt allein (&quot;Änderung speichern&quot;)
      300 automatisierte Test gebaut wurden. Daher wird kaum je manuell alles
      erschöpfend getestet. Meist nur das, woran gearbeitet wurde.
    </p>
    <p>
      Daher ist es wichtig und geplant, langfristig alle diese Tests zu
      automatisieren.
    </p>
    <ul>
      <li>
        alle Struktur-Elemente im Baum:
        <ul>
          <li className={styles.list}>✅ laden</li>
          <li className={styles.list}>◻️ filtern</li>
          <li className={styles.list}>✅ Änderung speichern</li>
          <li className={styles.list}>◻️ Kontextmenus ausführen</li>
          <li className={styles.list}>◻️ AP-Berichte testen</li>
        </ul>
      </li>
      <li className={styles.list}>◻️ Formular-Filter</li>
      <li>
        Karte
        <ul>
          <li>
            alle Layer
            <ul>
              <li className={styles.list}>◻️ anzeigen</li>
              <li className={styles.list}>◻️ Legenden anzeigen</li>
              <li className={styles.list}>◻️ stapeln</li>
              <li className={styles.list}>◻️ auf alle zoomen (apflora)</li>
              <li className={styles.list}>
                ◻️ auf markierten zoomen (apflora)
              </li>
            </ul>
          </li>
          <li>
            Karten-Filter
            <ul>
              <li className={styles.list}>◻️ zeichnen</li>
              <li className={styles.list}>◻️ löschen</li>
              <li className={styles.list}>◻️ im Navigationsbaum zeigen</li>
              <li className={styles.list}>◻️ in Exporten verwenden</li>
            </ul>
          </li>
          <li className={styles.list}>◻️ zoomen</li>
          <li className={styles.list}>◻️ maximieren</li>
          <li className={styles.list}>◻️ Messen</li>
          <li className={styles.list}>◻️ Download</li>
          <li>
            Koordinaten
            <ul>
              <li className={styles.list}>◻️ anzeigen</li>
              <li className={styles.list}>◻️ springen</li>
            </ul>
          </li>
          <li>
            Massstab
            <ul>
              <li className={styles.list}>◻️ anzeigen</li>
              <li className={styles.list}>◻️ wählen</li>
            </ul>
          </li>
          <li className={styles.list}>◻️ Distanz zeigen</li>
          <li className={styles.list}>◻️ Beobachtungen zuordnen</li>
        </ul>
      </li>
      <li className={styles.list}>◻️ Exporte</li>
      <li>
        Layout und Navigation
        <ul>
          <li className={styles.list}>◻️ back und forward des Browsers</li>
          <li className={styles.list}>☑️Tabs ein-/ausblenden</li>
          <li className={styles.list}>◻️ breite variieren</li>
          <li className={styles.list}>◻️ Anpassung an kleine Bildschirme</li>
        </ul>
      </li>
    </ul>
    <p>Symbole:</p>
    <ul>
      <li className={styles.list}>✅: automatisiert</li>
      <li className={styles.list}>☑️: teilweise automatisiert</li>
      <li className={styles.list}>◻️: todo</li>
    </ul>
  </>
)
