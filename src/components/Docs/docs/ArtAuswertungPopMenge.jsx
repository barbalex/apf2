import { DokuDate } from '..'

const ArtAuswertungPopMenge = () => (
  <>
    <h1>Art: Auswertung Population Mengen</h1>
    <DokuDate>27.03.2020</DokuDate>
    <h3>Rahmen-Bedingungen</h3>
    <ul>
      <li>Pro Jahr</li>
      <li>Ebene Art</li>
      <li>
        Pop mit der Menge ihrer aus allen TPop summierten ziel-relevanten
        Einheit aus der jüngsten Zählung oder Anpflanzung
      </li>
    </ul>
    <h3>Basis-Daten</h3>
    <ul>
      <li>
        <p>
          Ap, Pop und TPop aus den jährlich historisierten Daten:{' '}
          <code>ap_history</code>, <code>pop_history</code> und{' '}
          <code>tpop_history</code>
        </p>
        <ul>
          <li>nur Pop und TPop mit den Stati 100, 200, 201</li>
          <li>
            nur für den AP-Bericht relevante TPop Mehr zu der Historisierung von
            Art, Pop und TPop <a href="./historisierung">hier</a>.
          </li>
        </ul>
      </li>
      <li>
        <p>Die für das entsprechende Jahr jüngste Kontrolle</p>
        <ul>
          <li>mit der ziel-relevanten Einheit</li>
          <li>mit einer Anzahl</li>
          <li>von TPop mit Status 100, 200, 201</li>
        </ul>
      </li>
      <li>
        <p>Die für das entsprechende Jahr jüngste Anpflanzung</p>
        <ul>
          <li>wenn danach (noch) keine Kontrolle erfolgte</li>
          <li>mit der ziel-relevanten Einheit</li>
          <li>mit einer Anzahl</li>
          <li>von TPop mit Status 200 oder 201</li>
        </ul>
      </li>
    </ul>
    <h3>Manuelle Neu-Berechnung nach Daten-Änderungen</h3>
    <p>
      Die Auswertung dieser Daten ist sehr aufwändig. Daher werden diese Daten
      nicht bei jedem Aufruf der Auswertung neu gerechnet.
    </p>
    <p>
      Wenn Benutzer mit der Rolle &quot;Manager&quot; Daten historisieren, wird
      die Auswertung automatisch neu gerechnet.
    </p>
    <p>
      Wenn ihr bei einem AP die ziel-relevante Einheit ändert, müsst ihr die
      Neu-Berechnung selber auslösen: Dafür klickt ihr neben dem Titel der
      Grafik auf die entsprechende Schaltfläche.
    </p>
  </>
)

export default ArtAuswertungPopMenge
