import { dokuDate } from '../DesktopDocs.module.css'
import { list } from './Testen.module.css'

export const Component = () => (
  <>
    <h1>Funktionalität testen</h1>
    <p className={dokuDate}>18.04.2019</p>
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
          <li className={list}>✅ laden</li>
          <li className={list}>◻️ filtern</li>
          <li className={list}>✅ Änderung speichern</li>
          <li className={list}>◻️ Kontextmenus ausführen</li>
          <li className={list}>◻️ AP-Berichte testen</li>
        </ul>
      </li>
      <li className={list}>◻️ Formular-Filter</li>
      <li>
        Karte
        <ul>
          <li>
            alle Layer
            <ul>
              <li className={list}>◻️ anzeigen</li>
              <li className={list}>◻️ Legenden anzeigen</li>
              <li className={list}>◻️ stapeln</li>
              <li className={list}>◻️ auf alle zoomen (apflora)</li>
              <li className={list}>◻️ auf markierten zoomen (apflora)</li>
            </ul>
          </li>
          <li>
            Karten-Filter
            <ul>
              <li className={list}>◻️ zeichnen</li>
              <li className={list}>◻️ löschen</li>
              <li className={list}>◻️ im Navigationsbaum zeigen</li>
              <li className={list}>◻️ in Exporten verwenden</li>
            </ul>
          </li>
          <li className={list}>◻️ zoomen</li>
          <li className={list}>◻️ maximieren</li>
          <li className={list}>◻️ Messen</li>
          <li className={list}>◻️ Download</li>
          <li>
            Koordinaten
            <ul>
              <li className={list}>◻️ anzeigen</li>
              <li className={list}>◻️ springen</li>
            </ul>
          </li>
          <li>
            Massstab
            <ul>
              <li className={list}>◻️ anzeigen</li>
              <li className={list}>◻️ wählen</li>
            </ul>
          </li>
          <li className={list}>◻️ Distanz zeigen</li>
          <li className={list}>◻️ Beobachtungen zuordnen</li>
        </ul>
      </li>
      <li className={list}>◻️ Exporte</li>
      <li>
        Layout und Navigation
        <ul>
          <li className={list}>◻️ back und forward des Browsers</li>
          <li className={list}>☑️Tabs ein-/ausblenden</li>
          <li className={list}>◻️ breite variieren</li>
          <li className={list}>◻️ Anpassung an kleine Bildschirme</li>
        </ul>
      </li>
    </ul>
    <p>Symbole:</p>
    <ul>
      <li className={list}>✅: automatisiert</li>
      <li className={list}>☑️: teilweise automatisiert</li>
      <li className={list}>◻️: todo</li>
    </ul>
  </>
)
