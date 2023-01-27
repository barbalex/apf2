import styled from '@emotion/styled'

import { DokuDate } from '..'

const LI = styled.li`
  list-style-type: none;
`

const Testen = () => (
  <>
    <h1>Funktionalität testen</h1>
    <DokuDate>18.04.2019</DokuDate>
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
          <LI>✅ laden</LI>
          <LI>◻️ filtern</LI>
          <LI>✅ Änderung speichern</LI>
          <LI>◻️ Kontextmenus ausführen</LI>
          <LI>◻️ AP-Berichte testen</LI>
        </ul>
      </li>
      <LI>◻️ Formular-Filter</LI>
      <li>
        Karte
        <ul>
          <li>
            alle Layer
            <ul>
              <LI>◻️ anzeigen</LI>
              <LI>◻️ Legenden anzeigen</LI>
              <LI>◻️ stapeln</LI>
              <LI>◻️ auf alle zoomen (apflora)</LI>
              <LI>◻️ auf markierten zoomen (apflora)</LI>
            </ul>
          </li>
          <li>
            Karten-Filter
            <ul>
              <LI>◻️ zeichnen</LI>
              <LI>◻️ löschen</LI>
              <LI>◻️ im Strukturbaum zeigen</LI>
              <LI>◻️ in Exporten verwenden</LI>
            </ul>
          </li>
          <LI>◻️ zoomen</LI>
          <LI>◻️ maximieren</LI>
          <LI>◻️ Messen</LI>
          <LI>◻️ Download</LI>
          <li>
            Koordinaten
            <ul>
              <LI>◻️ anzeigen</LI>
              <LI>◻️ springen</LI>
            </ul>
          </li>
          <li>
            Massstab
            <ul>
              <LI>◻️ anzeigen</LI>
              <LI>◻️ wählen</LI>
            </ul>
          </li>
          <LI>◻️ Distanz zeigen</LI>
          <LI>◻️ Beobachtungen zuordnen</LI>
        </ul>
      </li>
      <LI>◻️ Exporte</LI>
      <li>
        Layout und Navigation
        <ul>
          <LI>◻️ back und forward des Browsers</LI>
          <LI>☑️Tabs ein-/ausblenden</LI>
          <LI>◻️ breite variieren</LI>
          <LI>◻️ Anpassung an kleine Bildschirme</LI>
        </ul>
      </li>
    </ul>
    <p>Symbole:</p>
    <ul>
      <LI>✅: automatisiert</LI>
      <LI>☑️: teilweise automatisiert</LI>
      <LI>◻️: todo</LI>
    </ul>
  </>
)

export default Testen
