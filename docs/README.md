# apflora.ch

Web-Applikation zur Verwaltung der [Aktionspläne Flora der Fachstelle Naturschutz des Kantons Zürich](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/artenfoerderung/ap_fl.html).

## Was kann man mit apflora.ch machen?

**Aktionspläne verwalten**

- Aktionspläne, Populationen und Teilpopulationen beschreiben
- Ziele und Erfolgskriterien bestimmen
- Kontrollen der Teilpopulationen und...
- ...Massnahmen zur Förderung dokumentieren
- Die Entwicklung der Teilpopulationen, den Erfolg der Massnahmen und die Erreichung der Ziele beurteilen...
- ...und darüber berichten
- Ideale Umweltfaktoren beschreiben
- Assoziierte Arten auflisten

**Beobachtungen den Teilpopulationen zuordnen**

- Alle Beobachtungen der Info Flora innerhalb des Kantons Zürich und im nahen Umfeld
- Alle Beobachtungen aus Projekten der Fachstelle Naturschutz des Kantons Zürich
- Eigene Beobachtungen aus [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content)
- Grundsätzlich alle verfügbaren Beobachtungen, unabhängig von ihrer Datenstruktur
- Beobachtungen von beliebigen (synonymen) Arten im selben Aktionsplan zuordnen
- [Anleitung](./docs/beobZuordnen)

**Auf Karten darstellen**

- Aktionspläne, Populationen, Teilpopulationen und Beobachtungen...
- ...auf Luftbild, Übersichtsplan und Landeskarten anzeigen
- Diverse Ebenen einblenden (z.B. Bundesinventare, Kantonale Inventare, Parzellen)
- Beobachtungen durch Ziehen mit der Maus Teilpopulationen zuordnen
- Teilpopulationen verorten
- Teilpopulationen und Beobachtungen im GIS-Browser des Kt. Zürich und auf geo.admin.ch anzeigen
- Populationen und Teilpopulationen als kml-Datei für Google Earth exportieren

**Über den Erfolg berichten**

- Für einzelne Aktionspläne...
- ...oder für alle...
- ...über Massnahmen, Kontrollen und Entwicklung berichten
- direkt aus apflora.ch heraus pdf-Berichte erzeugen

**Daten exportieren**

- Alle Daten exportieren
- als .xlsx- oder .csv-Datei
- Auf der Karte beliebige Umrisse zeichnen, um Exporte geografisch zu filtern

**Auf die Plätze, fertig, los!**

- Keine Installation, automatische Updates
- Von ausserhalb (Auftragnehmer) und innerhalb der Fachstelle Naturschutz arbeiten
- Ein moderner Browser wird vorausgesetzt. Entwickelt für Google Chrome. Funktioniert auch auf Firefox und Safari für PC (vermutlich auch auf Edge) sowie Chrome für Android und Safari auf iOS
- Wer keinen modernen Browser einsetzen darf (wie z.B. die Fachstelle Naturschutz Kt. Zürich) oder aus einem anderen Grund lieber will, kann [hier](https://www.dropbox.com/sh/5ar4f0fu5uqvhar/AADJmUo_9pakOnjL_U27EpQMa?dl=0) die lokal installierbare Version beziehen. Für die Installation auf Windows den aktuellsten `apflora-win32-x64`-Ordner in den eigenen Benutzer-Ordner kopieren (oder irgendwo sonst, wo Sie über die Rechte verfügen, eine .exe-Datei auszuführen). Dann die darin enthaltene `apflora.exe` starten

**Sich rasch zurechtfinden**

- Über einen dynamisch aufgebauten Strukturbaum navigieren und dabei die Übersicht über die komplexe Hierarchie behalten
- Im Formular rechts des Baums die gewählten Daten bearbeiten
- Strukturbaum, Formular und Karte beliebig ein- und ausblenden und in der Grösse variieren

**Sich anleiten lassen**

- Informations-Symbole informieren direkt in den Formularen über Anforderungen an die Datenerfassung
- [Videos](https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J) demonstrieren das Arbeiten mit verschiedenen Teilen der Anwendung
- Hier, in dieser Dokumentations-Webseite sind wichtige Fragen erklärt bzw. werden künftig alle neuen Features bechrieben

**Effizient arbeiten**

- Im Strukturbaum in jeder Ebene filtern
- [Fomular-basierte Filter](https://barbalex.github.io/apf2/#/./docs/filter) anwenden
- Strukturelemente wie z.B. Teilpopulationen im Baum zu anderen Strukturelementen desselben Typs verschieben oder kopieren
- Für übersichtliches Kopieren/Verschieben zweites Strukturbaum-Formular-Paar einblenden
- Beobachtungen Teilpopulationen zuordnen: In einer nach Abstand zu den Teilpopulationen geordneten Liste im Formular. Oder mit drag and drop auf der Karte
- Aus einer Beobachtung eine neue Populationen und Teilpopulationen gründen und gleich die Beobachtung zuordnen. Mit einem einzigen Klick
- Alle Löschungen während einer Sitzung werden aufgelistet und können rückgängig gemacht werden
- Mit rund hundert Kontroll-Listen die Qualität der Daten gewährleisten

**Projektdaten verwalten**

Die nachfolgend aufgelisteten Funktionen werden nur von Topos verwendet:

- Adressen verwalten
- Logins verwalten und Schreibrechte vergeben
- Mit dem GIS auf die Daten zugreifen
- Beobachtungen nach [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) exportieren (separate Access-Anwendung)
- Beobachtungen aus einem [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importieren (um sie danach in apflora Teilpopulationen zuzuordnen) (separate Access-Anwendung)

**Daten nach Verlust wiederherstellen**

- Die Daten werden täglich in der Cloud gesichert
- In regelmässigen Abständen werden sie aus der Cloud auf mehrere unabhängige Festplatten gesichert
- Ihre Wiederherstellung wird im Rahmen der Entwicklung bzw. des Unterhalts regelmässig getestet
- Während einer Sitzung gelöschte Daten können direkt von den Benutzern wiederhergestellt werden

**Freiwilligen-Erfolgskontrollen vorbereiten**

- Aktionsplan-Verantwortliche erfassen, wer welche Teilpopulationen kontrollieren soll...
- ...und drucken gleich die Feld-Erfassungs-Formulare aus
- [Anleitung](https://barbalex.github.io/apf2/#/./docs/ekf)

**Freiwillige erfassen ihre Kontrollen selber**

- Melden sich Freiwillige an, sehen sie eine spezifisch für Sie gestaltete Benutzer-Oberfläche
- Neben der Liste ihrer Erfolgskontrollen erfassen sie im Formular, das genau dem Feld-Formular entspricht, ihre Beobachtungen

**Freiwilligen-Erfolgskontrollen für Jahres-Berichte nutzen**

- Aktionsplan-Verantwortliche überprüfen die Kontrollen von Freiwilligen und bestimmen, ob sie in den Jahres-Berichten berücksichtigt werden


## Produkte für die Fachstelle Naturschutz
Die FNS erhält aus apflora folgende Produkte:

- Den Jahresbericht (pdf oder Ausdruck)
- Artbeobachtungen<br>
Dazu werden die Feld- und Freiwilligenkontrollen (ausser solche von soeben angesäten, noch nicht etablierten Teilpopulationen) nach [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importiert
- Teilpopulationen, Kontrollen und Massnahmen für die Anzeige in GIS und [Web-GIS BUN](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/web_gis.html)


## Neu-Aufbau im Sommer 2017

2017 wurde apflora nach 5 Jahren von Grund auf neu aufgebaut.

### Ziele

- Architektur modernisieren:
  - Unterhalt- und Erweiterbarkeit verbessern.<br/>
    Neue Features einzuführen ist nun einfacher und mit weniger Risiko verbunden.<br/>
    Das war der Auslöser für die Modernisierung
  - Anzahl Karten-Werkzeuge von zwei auf eines reduzieren
  - Veraltete Abhängikeiten loswerden
  - (Infra-)Struktur für Tests bereitstellen (und später nach und nach einführen)
- Mehrere Projekte verwalten.<br/>
  Andere Kantone bzw. Ökobüros können ähnliche Projekte verwalten. Damit würden Fixkosten geteilt bzw. die Weiterentwicklung finanziert
- Grundlage schaffen, um Berichte direkt aus der Webanwendung heraus produzieren zu können.<br/>
  Artverantwortliche sollen Jahresberichte für ihre Arten selber erzeugen und kontrollieren können
- Grundlage schaffen, um auf das Access-Admin-Tool verzichten zu können (umgesetzt)
- Grundlage schaffen, um allenfalls später netzunabhängig (im Feld) arbeiten zu können
- Sicherheit erhöhen

### Neue Fähigkeiten

- Mehrere Projekte bearbeiten
- Der Strukturbaum ist wesentlich leistungsfähiger.<br />Es gibt keine Grenzen mehr, wieviele Elemente einen Ebene darstellen kann!
- Karten:
  - In der Karte verwendete Symbole werden im Ebenen-Tool und im Strukturbaum eingeblendet
  - Es werden immer alle Elemente einer Ebene angezeigt. Aktive sind gelb umrahmt
  - Bequeme(re) Messung von Flächen und Linien
  - Differenzierte(re) Darstellung der verschiedenen Typen von Beobachtungen<br />(nicht beurteilt, nicht zuzuordnen, zugeordnet)
  - Bequeme(re) Zuordnung von Beobachtungen zu Teil-Populationen
  - Bequemer(re) Darstellung von nahe bzw. direkt aufeinander liegenden Elementen
  - Populationen, Teilpopulationen und Beobachtungen durch das Zeichnen von einem oder mehreren Umrissen (Recht- oder Vielecken) filtern
  - Diesen geographischen Filter auf Exporte anwenden
- Daten auch in .xlsx-Dateien exportieren
- Beobachtungen können in beliebiger Datenstruktur importiert werden
- API-Zugriff ist durch Anmeldung geschützt

### 2018 geplant

- Login steuert, welche Projekte sichtbar sind (umgesetzt)
- Berichte direkt in apflora.ch erstellen (statt wie bisher in Access) (umgesetzt)
- Freiwilligen-Erfolgskontrollen: Internet-Eingabeformular entsprechend dem Feld-Formular schaffen. Ziel: Freiwillige erfassen ihre Kontrollen selber. Sie fliessen in die Auswertung ein, wenn sie von Mitarbeiterinnen von Topos geprüft wurden (umgesetzt)
- Filter-Funktionen ausbauen (umgesetzt)
- Von InfoFlora bezogene Beobachtungen können korrigiert und die Änderung per mail an InfoFlora gemeldet werden
- Diverse kleinere Optimierungen, um die Effizienz für die BenutzerInnen zu steigern

### Langfristige Vision

Heute wird apflora.ch für die Förderung von Flora-Arten verwendet. Ihre Grundstruktur eignet sich aber genau so gut für alle anderen Arten, z.B. Fauna und Moose...


## Technische Umsetzung

Die Anwendung wird auf einem virtuellen Server mit der jeweils aktuellen Ubuntu LTS Version gehostet.

Serverseitig wird sie mit [node.js](//nodejs.org) gesteuert. Als Datenbank dient [PostgreSQL](//postgresql.org/). Hier ein [Diagramm der Beziehungen](//raw.githubusercontent.com/barbalex/apf2/master/src/etc/beziehungen.png).

Die Anwendung ist zweigeteilt:
- das Backend bietet die API (Daten) auf [apflora.ch/graphql](//apflora.ch/graphql) und [apflora.ch/api](//apflora.ch/api) an
- das Frontend / die App bzw. die Benutzeroberfläche ist über [apflora.ch](//apflora.ch) erreichbar

Die wichtigsten verwendeten Technologien sind:

- [create-react-app](//github.com/facebookincubator/create-react-app): Abhängigkeiten einfach aktuell halten
- [GraphQL](https://github.com/facebook/graphql) in Form von [PostGraphile](https://github.com/graphile/postgraphile)
  - API-Server mit einer Zeile bauen und konfigurieren. Das sind _tausende_ weniger als bisher!
  - Daten-Logik und Rechte-Verwaltung obliegen der Datenbank - wie es sein sollte<br/>
  - GraphQL ist die kommende API-Technologie. Verglichen mit REST ist GraphQL einfach zu verstehen und extrem flexibel. Somit steht ein aussergewöhnlich benutzerfreundlicher API-Server zur Verfügung
- [Apollo](https://www.apollodata.com). Komponenten definieren, welche Daten sie brauchen. GraphQL und Apollo kümmern sich um die Bereitstellung. React (siehe unten), GraphQL und Apollo haben die Entwicklung von Anwendungen revolutioniert
- [React](//facebook.github.io/react): Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten
- [styled-components](https://github.com/styled-components/styled-components): modular stylen
- [Flow](//flow.org): Static type checker. Fehler finden, bevor der Code ausgeführt wird


## Open source

[![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/FNSKtZH/apflora/blob/master/License.md)

Die verwendete [Lizenz](https://github.com/barbalex/apf2/blob/master/license.md) ist sehr freizügig. Neben dem Code steht auch die [Datenstruktur](https://github.com/barbalex/apf2/tree/master/sql/apflora) zur Verfügung. Die eigentlichen Daten aber, mit denen gearbeitet wird, gehören der Fachstelle Naturschutz des Kantons Zürich und stehen nicht zur freien Verfügung. Die Beobachtungen werden an [Info Spezies](//www.infoflora.ch/de/allgemeines/info-species.html) geliefert.
