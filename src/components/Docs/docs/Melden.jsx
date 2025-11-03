import { dokuDate } from '../DesktopDocs.module.css'

export const Component = () => (
  <>
    <h1>Fehler, Ideen, Vorschläge melden</h1>
    <p className={dokuDate}>16.04.2019</p>
    <h2>Artverantwortliche und Freiwillige</h2>
    <p>
      Wendet euch bitte an <a href="mailto:kurz@toposmm.ch">Topos</a>.<br />
      Reine Software-Fehler könnt ihr auch direkt an{' '}
      <a href="mailto:alex@gabriel-software.ch">Alex, dem Entwickler</a> melden.
    </p>
    <p>
      Je besser ihr das Anliegen beschreibt, desto eher können wir das Problem
      lösen oder die Idee aufnehmen.
    </p>
    <h2>Mitarbeiterinnen von Topos</h2>
    <p>Das geht so:</p>
    <ul>
      <li>
        Auf{' '}
        <a
          href="https://github.com/barbalex/apf2/issues"
          target="_blank"
          rel="noreferrer"
        >
          <strong>GitHub</strong>
        </a>
        ...
      </li>
      <li>...schaut ihr bitte zuerst, ob euer Anliegen schon gemeldet wurde</li>
      <li>
        Wenn nicht, könnt ihr einen neuen <strong>Issue</strong> eröffnen
      </li>
    </ul>
    <p>
      GitHub ist geeignet, weil man die Übersicht behält, kategorisieren,
      priorisieren und den Verlauf dokumentieren kann. Jeder, der sich an einem
      Issue beteiligt, wird bei neuen Bemerkungen (z.B. wenn der Fehler
      korrigiert wurde) automatisch per email darüber informiert (und Alex
      immer).
    </p>
    <p>
      GitHub ist öffentlich. Ihr könnt Alex Anliegen auch per{' '}
      <a href="mailto:alex@gabriel-software.ch">email</a> melden.
    </p>
  </>
)
