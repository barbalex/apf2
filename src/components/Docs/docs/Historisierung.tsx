import desktopStyles from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Historisierung</h1>
    <p className={desktopStyles.dokuDate}>21.10.2026</p>
    <h2>Wunsch</h2>
    <p>Stand: Ende 2019</p>
    <p>Die Daten in apflora werden je länger je intensiver ausgewertet. </p>
    <p>Beispiele:</p>
    <ul>
      <li>
        Unmittelbar bevor steht die grafische Darstellung der zeitlichen
        Änderung (von Jahr zu Jahr) der Anzahl Populationen und ihrer Grösse
        gemäss ziel-relevanter Zähleinheit, differenziert nach Status.
      </li>
      <li>
        Der Jahresbericht soll ergänzt werden um &quot;Differenzen zum
        Vorjahr&quot;: &quot;die Anzahl Populationen, die es gegenüber dem
        Vorjahr zusätzlich oder weniger hat (oder 0, falls stabil), bei den
        ursprünglichen, bei den angesiedelten Pop und im Total&quot;.
      </li>
      <li>
        Die Priorisierung von AP-Arten ist abhängig von der Zu- oder Abnahme der
        Anzahl ursprünglicher Populationen (Spalte K) und der Anzahl
        Populationen total (ursp. und angesiedelt, Spalte L) und der
        Zielerreichung (nicht erfolgreich bis sehr erfolgreich, Spalte G)
      </li>
    </ul>
    <h2>Aktuelle Situation</h2>
    <p>Stand: Ende 2019</p>
    <p>
      Das Problem ist, dass die Daten von Art, Pop und TPop bei jeder
      Aktualisierung überschrieben werden. Die Veränderung mit der Zeit ist so
      nicht auswertbar.
    </p>
    <p>
      Mit der aktuellen Datenstruktur ist es wohl möglich, nachzuvollziehen, in
      welchen Jahren Populationen geschaffen wurden. Das heisst:{' '}
      <strong>In welchem Jahr gab es wie viele Populationen</strong>. Wenn ihr
      es zuverlässig nachführt, kann das Feld &quot;Bekannt seit&quot; dafür
      verwendet werden. Davon gehe ich aus. Bloss: Wenn eine Population entfernt
      wird, verschwindet sie dann auch in den Vorjahren aus der Statistik 🤔.
      Das sollte vermutlich nicht passieren, passiert aber eventuell dennoch.
    </p>
    <p>
      Hingegen ist es nicht möglich, zu{' '}
      <strong>wissen, wann Stati geändert wurden</strong>. Bzw. in welchem Jahr
      eine Population welchen Status hatte.
    </p>
    <h2>Lösung</h2>
    <ul>
      <li>
        Ein mal im Jahr (wenn der Jahresbericht erzeugt wird) werden alle Arten,
        Pop und TPop in eigene Tabellen kopiert
        <br />
        Nachtrag am 10.12.2020: Im verlauf eines Jahrs können die Daten
        jederzeit historisiert werden, bis spätestens Ende März des Folgejahrs.
        Wurde das betreffende Jahr schon historisiert, werden die alten Daten
        einfach überschrieben
      </li>
      <li>
        Abfragen könnten Historien verwenden, um die Änderung wesentlicher
        Felder wie z.B. Status oder AP-Bearbeitungsstand auszulesen
      </li>
      <li>Daten für Vorjahre wurden aus Sicherungen importiert</li>
    </ul>
    <h2>Umsetzung</h2>
    <ul>
      <li>
        <p>Es gibt drei neue Tabellen:</p>
        <ul>
          <li>
            <code>ap_history</code>
          </li>
          <li>
            <code>pop_history</code>
          </li>
          <li>
            <code>tpop_history</code>
          </li>
        </ul>
      </li>
      <li>
        Diese Tabellen haben dieselbe Struktur wie die jeweilige
        &quot;Mutter&quot;-Tabelle. Plus ein Jahr
      </li>
      <li>Jahr und ap/pop/tpop-id sind zusammen eindeutig</li>
      <li>
        Es gibt eine Funktion, um:
        <ul>
          <li>alle aktuellen ap/pop/tpop in diese Tabellen zu kopieren</li>
          <li>
            und mit dem <strong>VOR</strong>-Jahr zu ergänzen (weil man das wohl
            gegen Ende Februar des Folge-Jahrs macht)
          </li>
        </ul>
      </li>
      <li>
        In der Tabelle <code>apberuebersicht</code> gibt es ein neues Feld:
        history_date. Es wird von apflora gesetzt, wenn obige Funktion
        ausgeführt wird
      </li>
      <li>
        Im Formular &quot;AP-Berichte&quot; &gt; &quot;AP-Bericht
        Jahresübersicht&quot;
        <ul>
          <li>
            Gibt es einen neuen Befehl &quot;Art, Pop und TPop historisieren, um
            den zeitlichen Verlauf auswerten zu können&quot;
          </li>
          <li>Dieser Befehl kann nur von Managern ausgeführt werden</li>
          <li>
            Er kann nur ein Mal durchgeführt werden (sollte er ein mal zu früh
            ausgeführt worden sein und wiederholt werden müssen, müsstet ihr
            Alex darum bitten)
          </li>
          <li>
            Solltet ihr einmal vergessen, diesen Befehl im richtigen Moment
            auszuführen, müsste ich mit Daten aus Sicherungen dies nachträglich
            manuell machen
          </li>
          <li>
            Sobald er ausgeführt wurde, sieht man die Daten dieses
            Jahresberichts in den Auswertungen
          </li>
        </ul>
      </li>
      <li>
        Ich importiere Daten aus Sicherungen früherer Jahre, die gegen Ende
        Februar stattfanden, in die historien-Tabellen. Ich muss schauen, wie
        weit zurück das wie gut geht, weil z.T. ev. strukturelle Anpassungen
        stattfanden. Je nach vertretbarem Aufwand, versuche ich das so weit
        zurück auszuführen, wie die Stati vernünftig mit den aktuell verwendeten
        verglichen werden können
      </li>
    </ul>
    <h2>Daten</h2>
    <p>Aus Sicherungen wurden importiert: </p>
    <h3>ap</h3>
    <table>
      <thead>
        <tr>
          <th>Jahr</th>
          <th>Anzahl Datensätze</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2014</td>
          <td>471</td>
        </tr>
        <tr>
          <td>2015</td>
          <td>524</td>
        </tr>
        <tr>
          <td>2016</td>
          <td>561</td>
        </tr>
        <tr>
          <td>2017</td>
          <td>572</td>
        </tr>
        <tr>
          <td>2018</td>
          <td>573</td>
        </tr>
      </tbody>
    </table>
    <h3>pop</h3>
    <table>
      <thead>
        <tr>
          <th>Jahr</th>
          <th>Anzahl Datensätze</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2014</td>
          <td>4557</td>
        </tr>
        <tr>
          <td>2015</td>
          <td>5208</td>
        </tr>
        <tr>
          <td>2016</td>
          <td>5610</td>
        </tr>
        <tr>
          <td>2017</td>
          <td>5932</td>
        </tr>
        <tr>
          <td>2018</td>
          <td>6414</td>
        </tr>
      </tbody>
    </table>
    <h3>tpop</h3>
    <table>
      <thead>
        <tr>
          <th>Jahr</th>
          <th>Anzahl Datensätze</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>2014</td>
          <td>7791</td>
        </tr>
        <tr>
          <td>2015</td>
          <td>9155</td>
        </tr>
        <tr>
          <td>2016</td>
          <td>10116</td>
        </tr>
        <tr>
          <td>2017</td>
          <td>10930</td>
        </tr>
        <tr>
          <td>2018</td>
          <td>11975</td>
        </tr>
      </tbody>
    </table>
    <h2>Manuelle Ergänzungen</h2>
    <p>
      2026 wurde die Möglichkeit eingeführt, manuelle Ergänzungen in den
      Historien vorzunehmen. Als Grundregel gilt: Es braucht eine Historie,
      damit Daten in Diagrammen dargestellt werden können.
    </p>
  </>
)
