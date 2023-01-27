import { DokuDate } from '..'

const IstApfloraLangsam = () => (
  <>
    <h1>Ist apflora langsam?</h1>
    <DokuDate>18.04.2019</DokuDate>
    <p>Normalerweise sollte apflora nicht langsam wirken.</p>
    <h2>1. Das Problem</h2>
    <p>
      Nach einer BenutzerInnen-Aktion (z.B. Klicken oder Tippen) dauert es
      mehrere Sekunden, bis etwas passiert. Und zwar bei Vorgängen, die andere
      Male schnell waren. Oder apflora.ch reagiert gar nicht mehr.
    </p>
    <h2>2. Nicht das Problem</h2>
    <p>
      Bis ca. Mitte April 2019 war apflora.ch generell langsam. Dieses Problem
      sollte behoben sein.
    </p>
    <p>
      Die folgenden Vorgänge dauern immer (etwas) länger, weil sie mit sehr
      vielen Daten arbeiten oder sehr viel rechnen müssen:
    </p>
    <ul>
      <li>Im Strukturbaum eine Art öffnen, die sehr viele Daten enthält</li>
      <li>Einen (zweiten) Strukturbaum öffnen</li>
      <li>In der Karte Daten aller Arten anzeigen</li>
      <li>
        In der Karte (viele) apflora-Ebenen einblenden, wenn sie sehr viele
        Daten enthalten
      </li>
      <li>Daten exportieren, v.a. ab der Stufe Teilpopulationen</li>
      <li>Einen AP-Bericht über alle Arten als PDF öffnen</li>
    </ul>
    <h2>3. Die Lösung, wenn apflora die Ursache ist</h2>
    <p>
      Wir sind bestrebt, apflora.ch so schnell wie möglich zu machen. Wenn ihr
      beobachtet, dass bestimmte, im nächsten Titel nicht beschriebene Vorgänge
      apflora.ch regelmässig und nachvollziehbar stark bremsen, meldet uns das
      bitte. Leistungs-Probleme behandeln wir mit hoher Priorität.
    </p>
    <p>
      <strong>
        Wenn wir das Problem selber provozieren können, können wir es am ehesten
        lösen
      </strong>
      . Daher: Je genauer ihr das Problem beschreiben könnt, umso besser.
    </p>
    <p>Umgehungen, bis wir den Fehler behoben haben:</p>
    <ul>
      <li>
        apflora.ch neu laden.
        <br />
        Das kann bei Web-Apps generell bei Fehlern helfen. Dafür benutzt man die
        F5-Taste (alle Browser) oder das dafür vorgesehene Symbol (je nach
        Browser)
      </li>
      <li>
        Den cache des Browsers leeren. Danach müsst ihr neu anmelden.
        <br />
        Anleitungen für:{' '}
        <a href="https://superuser.com/a/444881/275664">Chrome</a>,{' '}
        <a href="https://superuser.com/a/733154/275664">Firefox</a>,{' '}
        <a href="https://superuser.com/a/1081295/275664">Safari</a>
        <br />
        apflora.ch speichert Daten auf eurer Festplatte (damit die App viel
        schneller läuft). Diese Daten können auch einmal Fehler enthalten. Cache
        leeren entfernt diese Daten, wonach sie vom Server neu geladen werden
      </li>
      <li>
        Die lokal installierbare Version von apflora.ch verwenden.
        <br />
        Es gibt sie bisher nur für Windows. Anleitung: Den aktuellsten
        apflora-win32-x64-Ordner von{' '}
        <a href="https://www.dropbox.com/sh/5ar4f0fu5uqvhar/AADJmUo_9pakOnjL_U27EpQMa?dl=0">
          hier
        </a>{' '}
        in den eigenen Benutzer-Ordner oder auf den Desktop kopieren. Dann die
        darin enthaltene apflora.exe-Datei starten. Ob das etwas bringt, wisst
        ihr nur, wenn ihr es ausprobiert habt
      </li>
    </ul>
    <p>
      Wenn obige Umgehungen offensichtlich nützen (mindestens kurzfristig), ist
      das ein Hinweis, dass apflora selber schuld ist.
    </p>
    <h2>4. Lösungen, wenn apflora nicht die Ursache ist</h2>
    <p>Die folgenden Massnahmen können in bestimmten Situationen helfen:</p>
    <ul>
      <li>
        Prüft, ob eure Internet-Verbindung zuverlässig funktioniert.
        <br />
        apflora.ch ist eine Web-App. Ohne Internet geht nix. Langsame
        Verbindungen führen zu - Langsamkeit 😉. Unzuverlässige (was manchmal
        schwer zu erkennen ist) zu kaum nachvollziehbaren Fehlern.
      </li>
      <li>
        Prüft, ob ihr einen kompatiblen Browser verwendet.
        <br />
        apflora.ch wird in Chrome gebaut und getestet. Das allermeiste sollte
        auch in Firefox, Safari, Edge und Opera funktionieren. Vermutlich gibt
        es aber die eine oder andere Funktion, die scheitert.
        <br />
        Jedenfalls muss die verwendete Version aktuell sein. Alte
        Browser-Versionen werden nicht unterstützt. Und sie können{' '}
        <strong>sehr</strong> viel langsamer sein.
      </li>
      <li>
        Schliesst andere Prozesse/Browser-Tabs/Programme.
        <br />
        apflora.ch lädt, verarbeitet und stellt viele Daten dar. Das beansprucht
        Arbeitsspeicher und CPU. Wird es dort zu eng, kann es Probleme geben.
        Aber normalerweise nur, wenn andere Tabs oder Anwendungen sehr viele
        Ressourcen beanspruchen und euer Computer eher alt ist.
      </li>
      <li>
        Startet euren Computer neu. Das Allerwelts-Heilmittel bei
        Computer-Schnupfen aller Art. Konkret: Es kann sein, dass irgend ein
        Prozess den Computer stark belastet. Neu starten beendet garantiert alle
        Prozesse.
      </li>
    </ul>
  </>
)

export default IstApfloraLangsam
