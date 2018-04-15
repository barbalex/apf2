# apflora.ch

Web-Applikation zur Verwaltung des [Aktionsplans Flora der Fachstelle Naturschutz des Kantons Zürich](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/artenfoerderung/ap_fl.html).

<a name="top"></a>
**Inhalt**

* <a href="#machen">Was kann man mit ApFloraDb machen?</a>
* <a href="#fns">Produkte für die Fachstelle Naturschutz</a>
* <a href="#Neuaufbau">Neu-Aufbau 2017</a>
* <a href="#Technik">Technische Umsetzung</a>
* <a href="#OpenSource">Open source</a>


<a name="machen"></a>
## Was kann man mit ApFloraDb machen?

**Aktionspläne verwalten:**

- Aktionspläne, Populationen und Teilpopulationen beschreiben
- Ideale Umweltfaktoren beschreiben
- Assoziierte Arten auflisten
- Ziele und Erfolgskriterien bestimmen
- Kontrollen der Teilpopulationen und...
- ...Massnahmen zur Förderung dokumentieren
- Die Entwicklung der Teilpopulationen, den Erfolg der Massnahmen und die Erreichung der Ziele beurteilen...
- ...und darüber berichten

**Beobachtungen den Teilpopulationen zuordnen:** ([Anleitung](https://github.com/FNSKtZH/apflora/wiki/Beobachtungen-einer-Teilpopulation-zuordnen))

- Alle Beobachtungen der Info Flora innerhalb des Kantons Zürich und im nahen Umfeld
- Alle Beobachtungen aus Projekten der Fachstelle Naturschutz des Kantons Zürich
- Eigene Beobachtungen aus [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) (vorgängig mit Access uploaden)
- Grundsätzlich alle verfügbaren Beobachtungen, unabhängig von ihrer Datenstruktur
- Beobachtungen von beliebigen (synonymen) Arten im selben Aktionsplan zuordnen

**Auf Karten darstellen:**

- Aktionspläne, Populationen, Teilpopulationen und Beobachtungen...
- ...auf Luftbild, Übersichtsplan und Landeskarten anzeigen
- Diverse Ebenen einblenden (z.B. Bundesinventare, Kantonale Inventare, Parzellen)
- Beobachtungen durch Ziehen mit der Maus Teilpopulationen zuordnen
- Teilpopulationen verorten
- Teilpopulationen und Beobachtungen im GIS-Browser des Kt. Zürich und auf geo.admin.ch anzeigen
- Populationen und Teilpopulationen als kml-Datei für Google Earth exportieren

**Daten exportieren:**

- Alle Daten exportieren
- als .xlsx- oder .csv-Datei
- Auf der Karte beliebige Umrisse zeichnen, um Exporte geographisch zu filtern

**Auf die Plätze, fertig, los!**

- Keine Installation, automatische Updates
- Von ausserhalb (Auftragnehmer) und innerhalb der Fachstelle Naturschutz arbeiten
- Ein moderner Browser wird vorausgesetzt. Entwickelt für Google Chrome. Funktioniert auch auf Firefox und Safari für PC sowie Chrome für Android und Safari auf iOS

**Sich rasch zurechtfinden:**

- Über einen dynamisch aufgebauten Strukturbaum navigieren und dabei die Übersicht über die komplexe Hierarchie behalten
- Im Formular rechts des Baums die gewählten Daten bearbeiten
- Strukturbaum, Formular und Karte beliebig ein- und ausblenden und in der Grösse variieren

**Sich anleiten lassen:**

- Informations-Symbole informieren über Felder und Anforderungen an die Datenerfassung
- Mehrere [Videos](https://www.youtube.com/playlist?list=PLTz8Xt5SOQPS-dbvpJ_DrB4-o3k3yj09J) demonstrieren das Arbeiten mit verschiedenen Teilen der Anwendung
- Im [Wiki](https://github.com/FNSKtZH/apflora/wiki) sind wichtige Fragen erklärt

**Effizient arbeiten:**

- Im Strukturbaum in jeder Ebene filtern
- Strukturelemente wie z.B. Teilpopulationen im Baum zu anderen Strukturelementen desselben Typs verschieben oder kopieren
- Für übersichtliches Kopieren/Verschieben zweites Strukturbaum-Formular-Paar einblenden
- Beobachtungen Teilpopulationen zuordnen: In einer nach Abstand zu den Teilpopulationen geordneten Liste im Formular. Oder mit drag and drop auf der Karte
- Aus einer Beobachtung eine neue Populationen und Teilpopulationen gründen und gleich die Beobachtung zuordnen. Mit einem einzigen Klick
- Alle Löschungen während einer Sitzung werden aufgelistet und können rückgängig gemacht werden
- Mit Dutzenden von Kontroll-Listen die Qualität der Daten gewährleisten

**Projektdaten verwalten:**

Die nachfolgend aufgelisteten Funktionen werden nur von Topos verwendet:

- pdf-Datei für den Jahresbericht erstellen
- Adressen verwalten
- Mit dem GIS auf die Daten zugreifen
- Logins verwalten und Schreibrechte vergeben
- Beobachtungen nach [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) exportieren
- Daten in Tabellenform bearbeiten
- Beobachtungen aus einem [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importieren (um sie danach in apflora Teilpopulationen zuzuordnen)

**Daten nach Verlust wiederherstellen:**

- Die Daten werden täglich in der Cloud gesichert
- In regelmässigen Abständen werden sie aus der Cloud auf mehrere unabhängige Festplatten gesichert
- Ihre Wiederherstellung wird im Rahmen der Entwicklung bzw. des Unterhalts regelmässig getestet ([Anleitung](https://github.com/FNSKtZH/apflora/wiki/Daten-wiederherstellen))

<a href="#top">&#8593; top</a>


<a name="fns"></a>
## Produkte für die Fachstelle Naturschutz
Die FNS erhält aus apflora folgende Produkte:

- Den Jahresbericht (pdf oder Ausdruck)
- Artbeobachtungen<br>
Dazu werden die Feld- und Freiwilligenkontrollen (ausser solche von soeben angesäten, noch nicht etablierten Teilpopulationen) in [EvAB](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html#a-content) importiert
- Teilpopulationen, Kontrollen und Massnahmen für die Anzeige in GIS und [Web-GIS BUN](http://www.aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/web_gis.html)

<a href="#top">&#8593; top</a>


<a name="Neuaufbau"></a>
## Neu-Aufbau im Sommer 2017

2017 wurde apflora nach 5 Jahren von Grund auf neu aufgebaut.

### Ziele:

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
- Grundlage schaffen, um auf das Access-Admin-Tool verzichten zu können
- Grundlage schaffen, um allenfalls später netzunabhängig (im Feld) arbeiten zu können
- Sicherheit erhöhen

### Neue Fähigkeiten:

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

### Geplant:

- Login steuert, welche Projekte sichtbar sind

<a href="#top">&#8593; top</a>

<a name="Technik"></a>
## Technische Umsetzung

Die Anwendung wird auf einem virtuellen Server mit der jeweils aktuellen Ubuntu LTS Version gehostet.

Serverseitig wird sie mit [node.js](//nodejs.org) gesteuert. Als Datenbank dient [PostgreSQL](//postgresql.org/). Hier ein [Diagramm der Beziehungen](//apflora.ch/static-files/beziehungen.png).

Die Anwendung ist zweigeteilt:
- das Backend bietet die API (Daten) auf [apflora.ch/api](//apflora.ch/api) an
- das Frontend / die App bzw. die Benutzeroberfläche ist über [apflora.ch](//apflora.ch) erreichbar

Die wichtigsten verwendeten Technologien sind:

- [create-react-app](//github.com/facebookincubator/create-react-app): Abhängigkeiten einfach aktuell halten
- [MobX](//github.com/mobxjs/mobx): Anwendungs-Daten managen. Reaktiv wie Excel. Simpler als redux
- [recompose](https://github.com/acdlite/recompose): Logik und Benutzeroberfläche sauber trennen
- [React](//facebook.github.io/react): Deklarative Benutzer-Oberfläche. Aufgebaut aus Komponenten
- [styled-components](https://github.com/styled-components/styled-components): modular stylen
- [Flow](//flow.org): Static type checker. Fehler finden, bevor der Code ausgeführt wird
- [PostgREST](//postgrest.com): Null-Aufwand-API. Dank dessen Benutzug soll 2018 die gesammte Datenstruktur modernisiert und für den Nachfolger von PostgREST ([GraphQL](https://graphql.org/)) optimiert werden 

<a href="#top">&#8593; top</a>


<a name="OpenSource"></a>
## Open source [![js-standard-style](https://img.shields.io/badge/license-ISC-brightgreen.svg)](https://github.com/FNSKtZH/apflora/blob/master/License.md)

Die verwendete [Lizenz](https://github.com/FNSKtZH/apflora/blob/master/License.md) ist sehr freizügig. Neben dem Code steht auch die [Datenstruktur](https://github.com/FNSKtZH/apflora/blob/master/etc/apflora_struktur.sql) zur Verfügung. Die eigentlichen Daten aber, mit denen gearbeitet wird, gehören der Fachstelle Naturschutz des Kantons Zürich und stehen nicht zur freien Verfügung. Die Beobachtungen werden an [Info Spezies](//www.infoflora.ch/de/allgemeines/info-species.html) geliefert.

Wer will, kann selber die [Entwicklungsumgebung einrichten](https://github.com/FNSKtZH/apflora/wiki/Entwicklungsumgebung-einrichten) und die [Anwendung auf einem Webserver bereitstellen](https://github.com/FNSKtZH/apflora/wiki/Anwendung-auf-einem-Server-bereitstellen).

<a href="#top">&#8593; top</a>
