import { Link } from 'react-router'
import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Art: Auswertung Population Mengen 📈</h1>
    <p className={desktopStyles.dokuDate}>
      27.03.2020 (Ebene Population ergänzt am 31.3.2023, Rechen-Regeln
      überarbeitet am 1.10.2026)
    </p>
    <p>
      Die vollständigen und verbindlichen Rechen-Regeln sind im{' '}
      <a href="https://github.com/barbalex/apf2/issues/794">Issue 794</a>{' '}
      dokumentiert und werden nachgeführt.
    </p>
    <h3>Rahmen-Bedingungen</h3>
    <ul>
      <li>Pro Jahr</li>
      <li>
        Gilt gleichermassen für die Auswertung auf Ebene Art (Pop werden
          summiert) wie auf Ebene Population (TPop werden einzeln dargestellt)
      </li>
      <li>
        Dargestellt wird die ziel-relevante Menge: die jüngste Zählung und die
        seither erfolgten Anpflanzungen
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
          <li>
            nur Pop und TPop mit den Stati 100 (ursprünglich, aktuell), 101
            (ursprünglich, erloschen), 200 (angesiedelt, aktuell), 202
            (angesiedelt, erloschen)
          </li>
          <li>nur für den AP-Bericht relevante TPop</li>
        </ul>
      </li>
      Dies führt dazu, dass nur Ergebnisse aus den Jahren angezeigt werden
      können, für die Historisierungen vorliegen. Daten aus Jahren ohne
      Historie werden nie berücksichtigt – auch nicht als übernommene
      Vorjahreswerte.
      <br />
      Mehr zu der Historisierung von Art, Pop und TPop{' '}
      <Link to="/Dokumentation/historisierung">hier</Link>.
    </ul>
    <ul>
      <li>
        <p>Zählungen (Kontrollen mit Zählung)</p>
        <ul>
          <li>nur mit der ziel-relevanten Einheit und einer Anzahl (auch 0)</li>
          <li>
            nicht markiert als: &quot;Im Jahresbericht nicht
            berücksichtigen&quot;
          </li>
          <li>
            gibt es in einem Jahr mehrere, wird die jüngste verwendet. Kann die
            jüngste nicht eindeutig ermittelt werden (fehlende Daten), wird
            deterministisch gewählt: die mit Datum vor denjenigen ohne Datum,
            danach die mit dem niedrigsten Erfassungsdatum der Kontrolle
            (created_at), der niedrigsten Erfassungsdatum der Zählung, der
            niedrigsten Kontrolle-ID und der niedrigsten Zählungs-ID. Solche
            Daten-Zustände werden von Qualitätskontrollen erfasst
          </li>
          <li>
            fehlt in einem Jahr eine Zählung, wird die jüngste zuvor erfolgte
            verwendet
          </li>
          <li>
            TPop mit Status &quot;erloschen&quot; werden mit der Anzahl 0
            berechnet, sofern im betreffenden Jahr keine Zählung existiert.
            Diese 0 ersetzt ältere Zählungen, bis eine neue Zählung erfolgt
          </li>
        </ul>
      </li>
      <li>
        <p>Anpflanzungen (Massnahmen der Typen &quot;Anpflanzung&quot; und &quot;Ansaat und Auspflanzung&quot;)</p>
        <ul>
          <li>nur mit der ziel-relevanten Einheit und einer Anzahl</li>
          <li>
            additiv zur jüngsten Zählung werden alle Anpflanzungen zwischen
            der jüngsten Zählung und dem Ende des auszuwertenden Jahrs addiert
          </li>
          <li>
            existiert (noch) keine Zählung, werden alle zuvor erfolgten
            Anpflanzungen addiert
          </li>
          <li>
            ist das Jahr entscheidend: Anpflanzungen aus Jahren vor der Zählung
            werden nie addiert, aus Jahren danach immer. Nur bei Anpflanzung
            und Zählung im selben Jahr entscheidet das Datum. Fehlt dabei ein
            Datum, wird die Anpflanzung nicht addiert
          </li>
        </ul>
      </li>
    </ul>
    <h3>Population: Auswertung Teil-Population Mengen</h3>
    <p>
      In Populationen gibt es eine analoge Auswertung wie auf Ebene Art. Es
      gelten dieselben Rechen-Regeln, dargestellt wird auf Ebene der
      Teil-Populationen.
    </p>
  </>
)
