import { DokuDate } from '..'

const Ekf = () => (
  <>
    <h1>Erfolgs-Kontrollen Freiwillige (EKF)</h1>
    <DokuDate>13.01.2020</DokuDate>
    <p>
      Freiwilligen-Kontrollen bzw. Erfolgs-Kontrollen Freiwillige werden
      nachfolgend mit &quot;EKF&quot; abgekürzt.
    </p>
    <h2>Das Formular</h2>
    <ul>
      <li>
        Benutzer mit der Rolle &quot;artverantwortich&quot; oder
        &quot;manager&quot; können neue EKF erstellen. Benutzer mit der Rolle
        &quot;freiwillig&quot; können nur die darin enthaltenen Felder ausfüllen
      </li>
      <li>
        Im Gegensatz zum Feldkontroll-Formular sind die Zählungen hier
        integriert
      </li>
      <li>
        Erstellt man eine neue EKF, werden die im Strukturbaum unter der Art im
        Knoten &quot;EK-Zähleinheiten&quot; aufgelisteten maximal 3
        Zähleinheiten erzeugt
      </li>
      <li>
        Man kann Zähleinheiten entfernen, aber keine hinzufügen, die nicht unter
        &quot;EK-Zähleinheiten&quot; aufgelistet sind
      </li>
      <li>
        Das Formular kann gedruckt werden. Das funktioniert aber vermutlich nur
        auf Chrome (hoffentlich) richtig. Unter &quot;Weitere
        Einstellungen&quot; muss man &quot;Hintergrundgrafiken&quot; wählen,
        damit das Bild auch im Druck erscheint
      </li>
      <li>
        Einige der Funktionen sind nur für Benutzer mit der Rolle
        &quot;artverantwortich&quot; oder &quot;manager&quot; sichtbar, und zwar
        nur in der Normal-Ansicht:
        <ul>
          <li>GUID kopieren</li>
          <li>Im Jahresbericht berücksichtigen</li>
        </ul>
      </li>
      <li>Das Formular passt sich an schmale Bildschirme an</li>
    </ul>
    <h2>Die Arbeitsabläufe</h2>
    <h3>
      1. Artverantwortliche oder Managerin bereitet Freiwilligen-Feldarbeit vor
    </h3>
    <p>Benutzer von apflora können folgende Rollen erhalten:</p>
    <ul>
      <li>artverantwortlich</li>
      <li>manager</li>
      <li>freiwillig</li>
    </ul>
    <p>
      Beispiel: &quot;Rebecca&quot; bereitet die Arbeit von &quot;Simone
      Freiwillig&quot; vor:
    </p>
    <ol>
      <li>
        Rebecca erfasst Simone Freiwillig als Benutzerin mit der Rolle
        &quot;freiwillig&quot;
      </li>
      <li>
        Wichtig: Die zugehörige Adresse von Simone Freiwillig ist im Formular
        &quot;Benutzer&quot; zu wählen. Nur so kann apflora die richtigen
        Kontrollen anzeigen, wenn Simone Freiwillig einloggt.
        <br />
        Wählt man im EKF-Formular eine Beobachterin, die nicht wie oben
        beschrieben mit einem Benutzer verbunden wurde, wird man darauf
        hingewiesen
      </li>
      <li>
        Rebecca setzt bei allen Teil-Populationen, die von Simone Freiwillig
        kontrolliert werden sollen, Simone Freiwillig als EKF-Kontrolleurin
        <br />
        Für Einzelfälle ist es auch möglich, bei der von Simone Freiwillig zu
        kontrollierenden Teil-Population: 1. eine neue EKF zu erstellen 2. darin
        Simone Freiwillig als Beobachterin zu erfassen 3. das Formular zu
        drucken
      </li>
      <li>
        Rebecca navigiert im Navigationsbaum zum Benutzer. Hier wählt sie den
        Befehl &quot;EKF-Formulare für 2020 erzeugen&quot; (jeweils das aktuelle
        Jahr). Dieser Befehl ist nur sichtbar, wenn es Teil-Populationen gibt,
        in denen der Benutzer EKF-Kontrolleur ist
      </li>
      <li>
        Wurden alle EKF-Formulare geschaffen, erscheint ein Befehl, um direkt in
        die EKF-Ansicht dieses Benutzers zu wechseln. Wo neu alle Formulare
        gleichzeitig gedruckt werden können
      </li>
      <li>
        Wenn nun Simone Freiwillig von Rebecca die Formulare bekommt, sind in
        apflora.ch alle ihre EKF erfasst
      </li>
    </ol>
    <h3>2. Freiwillige erfasst Daten im Feld</h3>
    <p>...auf den Papier-Formularen</p>
    <h3>3. Freiwillige digitalisiert ihre Feld-Formulare</h3>
    <ol>
      <li>
        Loggt Simone Freiwillig nach der Feldarbeit in apflora.ch ein, um ihre
        Feld-Formulare zu übertragen, öffnet sich die{' '}
        <strong>EKF-Ansicht</strong>: Simone Freiwillig sieht die Liste aller
        EKF dieses Jahres (inkl. diejenigen, die noch kein Datum haben), bei
        denen sie als Beobachterin erfasst ist
      </li>
      <li>
        Die Liste ist sortiert nach: Projekt, Art, Population, Teil-Population
        (Projekt würde nur angezeigt, wenn in mehreren Projekten EKF für diese
        Mitarbeiterin existierten)
      </li>
      <li>
        Simone Freiwillig wählt in der Liste die gewünschte Kontrolle. Und
        überträgt rechts daneben ihr Feld-Formular ins apflora-Formular
      </li>
      <li>In der Titelleiste wird das aktuelle Erfassungs-Jahr angezeigt</li>
      <li>
        Man kann ein anderes Jahr wählen. In diesem Fall werden die EKF der
        angemeldeten Benutzerin aus dem betreffenden Jahr angezeigt. Nicht aber
        die Kontrollen ohne Datum: diese werden nur angezeigt, wenn das gewählte
        Jahr dem aktuellen Feld-Jahr entspricht
      </li>
      <li>
        Simone Freiwillig kann ihr Passwort ändern, indem sie oben rechts auf
        die Schaltfläche klickt, die ihren Benutzer-Namen anzeigt
      </li>
    </ol>
    <h3>
      4. Artverantwortliche oder Managerin überprüft die Arbeit von Simone
      Freiwillig
    </h3>
    <ol>
      <li>
        Die Artverantwortliche kann die &quot;EKF-Ansicht&quot; einer Bestimmten
        Freiwilligen-Kontrolleurin wählen: Menu &quot;Mehr&quot; &gt; &quot;EKF
        sehen als&quot; (und hier die Kontrolleurin wählen)
      </li>
      <li>
        Im Feld &quot;Im Jahresbericht berücksichtigen&quot; kann sie
        &quot;nein&quot; setzten, wenn sie dokumentieren will, dass die
        Kontrolle bei der Erstellung von Kontroll-Berichten nicht berücksichtigt
        werden soll
      </li>
      <li>
        Damit eine EKF sich im Jahresbericht ausdruckt, muss (wie bei den
        Feld-Kontrollen) ein entsprechender Kontroll-Bericht erfasst werden
      </li>
      <li>
        Die Zahlen im Jahresbericht basieren auf den Kontroll-Berichten, nicht
        auf den Kontrollen. Eine zweifelhafte Kontrolle wird daher nicht im
        Jahresbericht sichtbar, wenn für sie kein Kontroll-Bericht erfasst wurde
      </li>
    </ol>
  </>
)

export default Ekf
