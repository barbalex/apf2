import { memo } from 'react'
import { Link } from 'react-router'

import { DokuDate } from '../DesktopDocs.jsx'

export const Component = memo(() => (
  <>
    <h1>Was kann man mit apflora.ch machen? 💪</h1>
    <DokuDate>20.12.2024</DokuDate>
    <h3>Arten verwalten</h3>
    <ul>
      <li>Arten, Populationen und Teilpopulationen beschreiben</li>
      <li>Ziele und Erfolgskriterien bestimmen</li>
      <li>Kontrollen der Teilpopulationen und...</li>
      <li>...Massnahmen zur Förderung dokumentieren</li>
      <li>
        Die Entwicklung der Teilpopulationen, den Erfolg der Massnahmen und die
        Erreichung der Ziele beurteilen...
      </li>
      <li>...und darüber berichten</li>
      <li>Ideale Umweltfaktoren beschreiben</li>
      <li>Assoziierte Arten auflisten</li>
    </ul>
    <h3>Beobachtungen den Teilpopulationen zuordnen</h3>
    <ul>
      <li>
        Alle Beobachtungen der{' '}
        <a
          href="https://infoflora.ch"
          target="_blank"
          rel="noreferrer"
        >
          Info Flora
        </a>{' '}
        innerhalb des Kantons Zürich und im nahen Umfeld
      </li>
      <li>
        Von Info Flora bezogene Beobachtungen können korrigiert und die Änderung
        per mail an InfoFlora gemeldet werden&nbsp;
        <Link to="/Dokumentation/falsch-bestimmte-beobachtungen/">
          (Anleitung)
        </Link>
      </li>
      <li>
        Alle verfügbaren Beobachtungen, unabhängig von ihrer Datenstruktur
      </li>
      <li>
        Beobachtungen von beliebigen (synonymen) Taxa der selben Art zuordnen
      </li>
      <li>
        <Link to="/Dokumentation/beobachtungen-einer-teil-population-zuordnen">
          Anleitung
        </Link>
      </li>
    </ul>
    <h3>Auf Karten darstellen</h3>
    <ul>
      <li>Arten, Populationen, Teilpopulationen und Beobachtungen...</li>
      <li>...auf Luftbild, Übersichtsplan und Landeskarten anzeigen</li>
      <li>
        Diverse Ebenen einblenden (z.B. Bundesinventare, Kantonale Inventare,
        Parzellen)
      </li>
      <li>Beobachtungen durch Ziehen mit der Maus Teilpopulationen zuordnen</li>
      <li>Teilpopulationen verorten</li>
      <li>
        Teilpopulationen und Beobachtungen im GIS-Browser des Kt. Zürich und auf
        geo.admin.ch anzeigen
      </li>
      <li>
        Populationen und Teilpopulationen als kml-Datei für Google Earth
        exportieren
      </li>
    </ul>
    <h3>Über den Erfolg berichten</h3>
    <ul>
      <li>Für einzelne Arten...</li>
      <li>...oder für alle...</li>
      <li>...über Massnahmen, Kontrollen und Entwicklung berichten</li>
      <li>direkt aus apflora.ch heraus pdf-Berichte erzeugen</li>
    </ul>
    <h3>Daten exportieren</h3>
    <ul>
      <li>Alle Daten exportieren</li>
      <li>als .xlsx- oder .csv-Datei</li>
      <li>
        Auf der Karte beliebige Umrisse zeichnen, um Exporte geografisch zu
        filtern
      </li>
    </ul>
    <h3>Auf die Plätze, fertig, los!</h3>
    <ul>
      <li>Keine Installation, automatische Updates</li>
      <li>
        Von ausserhalb (Auftragnehmer) und innerhalb der Fachstelle Naturschutz
        arbeiten
      </li>
      <li>Login&#39;s werden von Topos vergeben</li>
    </ul>
    <h3>Sich rasch zurechtfinden</h3>
    <ul>
      <li>
        Über einen dynamisch aufgebauten Navigationsbaum navigieren und dabei
        die Übersicht über die komplexe Hierarchie behalten
      </li>
      <li>Im Formular rechts des Baums die gewählten Daten bearbeiten</li>
      <li>
        Navigationsbaum, Formular und Karte beliebig ein- und ausblenden und in
        der Grösse variieren
      </li>
    </ul>
    <h3>Sich anleiten lassen</h3>
    <ul>
      <li>
        Informations-Symbole informieren direkt in den Formularen über
        Anforderungen an die Datenerfassung
      </li>
      <li>
        <a
          href="https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J"
          target="_blank"
          rel="noreferrer"
        >
          Videos
        </a>{' '}
        demonstrieren das Arbeiten mit verschiedenen Teilen der Anwendung
      </li>
      <li>
        Hier sind wichtige Fragen erklärt und werden künftig alle neuen Features
        beschrieben
      </li>
    </ul>
    <h3>Effizient arbeiten</h3>
    <ul>
      <li>Im Navigationsbaum in jeder Ebene nach dem Label filtern</li>
      <li>
        <Link to="/Dokumentation/filter">Fomular-basiert filtern</Link>
      </li>
      <li>
        Strukturelemente wie z.B. Teilpopulationen im Baum zu anderen
        Strukturelementen desselben Typs verschieben oder kopieren
      </li>
      <li>
        Für übersichtliches Kopieren/Verschieben zweites
        Navigationsbaum-Formular-Paar einblenden
      </li>
      <li>
        Beobachtungen Teilpopulationen zuordnen: In einer nach Abstand zu den
        Teilpopulationen geordneten Liste im Formular. Oder mit drag and drop
        auf der Karte
      </li>
      <li>
        Aus einer Beobachtung eine neue Populationen und Teilpopulationen
        gründen und gleich die Beobachtung zuordnen. Mit einem einzigen Klick
      </li>
      <li>
        Alle Löschungen während einer Sitzung werden aufgelistet und können
        rückgängig gemacht werden
      </li>
      <li>
        Mit über hundert Kontroll-Abfragen die Qualität der Daten kontrollieren
      </li>
    </ul>
    <h3>Arbeiten, wo es passt</h3>
    <ul>
      <li>
        apflora wurde ursprünglich für die Arbeit am PC entwickelt. Einzelne
        Teil-Funktionen bleiben auch heute noch grossen Bildschirmen vorbehalten
      </li>
      <li>
        Die Navigation passt sich kleinen Bildschirmen an. Man kann auf Handy
        und Tablett bequem mit den Fingern arbeiten
      </li>
      <li>
        Siehe <Link to="/Dokumentation/navigation">Navigation</Link>
      </li>
    </ul>
    <h3>Freiwilligen-Erfolgskontrollen vorbereiten</h3>
    <ul>
      <li>
        Art-Verantwortliche erfassen, wer welche Teilpopulationen
        kontrolliert...
      </li>
      <li>...und drucken gleich die Feld-Formulare aus</li>
      <li>
        <Link to="/Dokumentation/erfolgs-kontrollen-freiwillige">
          Anleitung
        </Link>
      </li>
    </ul>
    <h3>Freiwillige erfassen ihre Kontrollen selber</h3>
    <ul>
      <li>
        Melden sich Freiwillige an, sehen sie eine spezifisch für Sie
        gestaltete, auf das notwendige Minimum reduzierte Benutzer-Oberfläche
      </li>
      <li>
        Neben der Liste ihrer Erfolgskontrollen erfassen sie im Formular, das
        genau dem Feld-Formular entspricht, ihre Beobachtungen
      </li>
    </ul>
    <h3>Freiwilligen-Erfolgskontrollen für Jahres-Berichte nutzen</h3>
    <ul>
      <li>
        Art-Verantwortliche überprüfen die Kontrollen von Freiwilligen und
        entscheiden, ob sie in den Jahres-Berichten berücksichtigt werden
      </li>
    </ul>
    <h3>Projektdaten verwalten</h3>
    <p>
      Die nachfolgend aufgelisteten Funktionen werden nur von Topos und
      Gabriel-Software verwendet:
    </p>
    <ul>
      <li>
        Adressen verwalten (in apflora, nur für Benutzer mit der Rolle
        &quot;manager&quot; sichtbar)
      </li>
      <li>
        Logins verwalten und Schreibrechte vergeben (in apflora, nur für
        Benutzer mit der Rolle &quot;manager&quot; sichtbar)
      </li>
      <li>Mit dem GIS auf die Daten zugreifen</li>
      <li>
        Beobachtungen nach{' '}
        <a
          href="https://infoflora.ch"
          target="_blank"
          rel="noreferrer"
        >
          Info Flora
        </a>{' '}
        exportieren
      </li>
      <li>
        Beobachtungen importieren (um sie danach in apflora Teilpopulationen
        zuzuordnen)
      </li>
    </ul>
    <h3>Daten nach Verlust wiederherstellen</h3>
    <ul>
      <li>Die Daten werden täglich in der Cloud gesichert</li>
      <li>
        In regelmässigen Abständen werden sie aus der Cloud auf mehrere
        unabhängige Festplatten gesichert
      </li>
      <li>
        Ihre gesamthafte Wiederherstellung wird im Rahmen der Entwicklung bzw.
        des Unterhalts regelmässig getestet (war aber noch nie nötig)
      </li>
      <li>
        Während einer Sitzung gelöschte Daten können direkt von den Benutzern
        wiederhergestellt werden
      </li>
    </ul>
    <br />
  </>
))
