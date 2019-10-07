---
typ: 'technDoku'
path: "/Dokumentation/Technisch/EvAB-Export"
date: "2019-05-16"
title: "EvAB-Export"
sort: 10
---

Feld- und Freiwilligen-Kontrollen entsprechen Beobachtungen. Ein mal jährlich (ca. im April) werden sie daher ins EvAB exportiert. Von dort gelangen sie zu InfoFlora.<br/><br/>

### Folgende Kontrollen werden exportiert
- Art: Keine Testart, keine von der FNS ergänzte Art
- Teilpopulation: Enthält gültige Koordinaten
- Teilpopulation: Enthält einen Flurnamen
- Teilpopulation: Ist kein Ansaatversuch
- Teilpopulation: Es wurde erfasst, seit wann sie bekannt ist
- Teilpopulation: Status ist ursprünglich oder die Ansiedlung ist mindestens 5 Jahre her (= sie ist seit mindestens 5 Jahren bekannt)
- Kontrolle: Ein gültiger Bearbeiter ist erfasst (nicht der Bearbeiter "Unbekannt")
- Kontrolle: Es existiert ein Kontrolljahr. Es liegt vor dem aktuellen (Kontrollen aus dem aktuellen Jahr wurden ev. noch nicht verifiziert)

### Folgende Felder werden exportiert
Die Feldnamen werden durch EvAB bestimmt. Die Listen-Titel bezeichnen die Tabelle bzw. Hierarchiestufe, in welche die Daten in EvAB importiert werden.<br/><br/>
Beobachtung:
- `EXPERTISE_INTRODUITE_NOM` ist der AP-Verantwortliche oder - bei dessen Fehlen - Topos
- `EXPERTISE_INTRODUIT` ist `C` (von einen Gutachter definiert)
- `ABONDANCE`: Anzahlen, Zähleinheiten und Methoden aller Zählungen werden kommagetrennt gelistet
- `STATION` (Standortsbeschreibung / Ökologie): Feld `beschreibung` der Teilpopulation
- `VITALITE_PLANTE`: Feld `vitalitaet` der Kontrolle
- `MENACES`: Feld `gefaehrdung` der Kontrolle
- `fkAAPRESENCE` (Vorhandensein, wird wohl nach `PRESENCE` exportiert):
  - Wenn 0 Pflanzen gezählt wurden _und im Jahr der Kontrolle "erloschen" berichtet wurde_: `erloschen/zerstört`
  - Sonst, wenn 0 Pflanzen gezählt wurden: `nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit)`
  - Übrige: `vorhanden`
- `fkAAINTRODUIT` (Herkunft, wird wohl nach `INTRODUIT` exportiert):
  - Status ist ursprünglich:
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt, es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt, es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
- `fkAA1` (Typ der Meldung, wird wohl nach `TY_NOTE` exportiert): `1` (Feldbeobachtung)
- `fkArtgruppe`: `18` (Flora)
- `fkAutor` (Beobachter, wird wohl nach `OBSERVATEURS` exportiert): ID der Person in EvAB

Zeitpunkt:
- `Datum`: Datum der Kontrolle. 1.1. des Jahrs, wenn es nur ein Jahr geben sollte.
- `fkGenauigkeitDatum`: `Tag`, wenn das Datum genau erfasst wurde. `Jahr`, wenn nur das Jahr existiert.
- `fkGenauigkeitDatumZDSF`: `P` (genau), wenn das Datum genau erfasst wurde. `X` (nicht definiert), wenn nur das Jahr existiert.
- `COUV_MOUSSES`: Feld `moosschicht` der Kontrolle.
- `COUV_HERBACEES`: Feld `krautschicht` der Kontrolle.
- `COUV_BUISSONS`: Feld `strauchschicht` der Kontrolle.
- `COUV_ARBRES`: Feld `baumschicht` der Kontrolle.

Ort:
- `Name`: Feld `flurname` der Teilpopulation. Plus, wenn vorhanden: Teilpopulations-Nummer.
- `Erfassungsdatum`: Export-Datum (ist in EvAB ein Mussfeld, existiert in apflora aber nicht).
- `fkAutor`: Topos (Person, welche den Ort erfasst hat. Mussfeld in EvAB. Existiert in apflora nicht).
- `fkLebensraumtyp`: LR-Typ nach Delarze (nicht alle Lebensraumtypen aus apflora.ch können importiert werden, weil EvAB eine ältere Version der Liste enthält als apflora, welches sich an arteigenschaften.ch ausrichtet)
- `fkGenauigkeitLage`: `1` (± 25m)
- `fkGeometryType`: `1` (Point)
- `obergrenzeHoehe`: Feld `hoehe` der Teilpopulation
- `fkGenauigkeitHoehe`: `4` (Nicht definiert)
- `X`: X-Koordinate der Teilpopulation
- `Y`: Y-Koordinate der Teilpopulation
- `NOM_COMMUNE`: Gemeinde der Teilpopulation
- `DESC_LOCALITE`: Flurname der Teilpopulation
- `ENV`: LR-Typ der Umgebung nach Delarze (nicht alle Lebensraumtypen aus apflora.ch können importiert werden, weil EvAB eine ältere Version der Liste enthält als apflora, welches sich an arteigenschaften.ch ausrichtet)
- `Bemerkungen`: Wenn ein Status existiert, werden hier Status und Bekannt seit eingetragen.

Raum:
- `Name`: Name der Population. Plus ihre Nummer, wenn sie existiert.
- `Erfassungsdatum`: Export-Datum. Ist in EvAB ein Mussfeld, wird in apfldora.ch nicht geführt.
- `fkAutor`: Topos. In EvAB wird hier erfasst, wer den Raum erfasst hat. Mussfeld. Wird in apflora nicht geführt.
- `Bemerkungen`: Status und Bekannt-seit-Datum der Population.

Projekt:
- `Name`: Name der Pflanzenart (für jede Art wird in EvAB ein Projekt erstellt)
- `Eroeffnung`: Startjahr des Aktionsplans. Oder, wenn es den nicht gibt: Export-Datum (ist in EvAB ein Mussfeld)
- `fkAutor`: Topos. In EvAB wird hier erfasst, wer das Projekt erfasst hat. Mussfeld. Wird in apflora nicht geführt.
- `Bemerkungen`: Bearbeitungsstand, Startjahr und Umsetzungsstand des Aktionsplans (sofern vorhanden)

### Vorgehen
Die FNS gibt vor, dass in eine Access-GEO-DB importiert werden muss. Leider gibt es keine vernünftigen Treiber, um Access mit PostgreSQL (oder irgend einer anderen Datenbank) zu verbinden. Und ODBC verträgt sich schlecht mit modernem und sicherem Hosting. Darum müssen alle benötigten Daten zuerst aus apflora.ch exportiert werden, in eine Access DB importiert und von dort in die GEO-DB importiert werden.<br/><br/>

1. Dateien vorbereiten:
   1. Neuen Ordner gründen (z.B. `...\projekte\apflora\data_out\2019 05 16 nach EvAB`)
   1. `beob_nach_evab.accdb` vom letzten Export kopieren
   1. Auf [naturschutz.zh.ch](https://aln.zh.ch/internet/baudirektion/aln/de/naturschutz/naturschutzdaten/tools/evab.html) das aktuelle Datenbank-Template für EvAB downloaden
   1. Datenbank-Template umbenennen zu: `EvabGeoDB_apflora.mdb`
   1. `beob_nach_evab.accdb` öffnen
   1. Tabellen-Verknüpfungs-Manager öffnen
   1. Neues Datenbank-Template verknüpfen
1. Adressen Vorbereiten
   1. Aktuelle tblPersonen aus `EvabGeoDB_apflora.mdb` in apflora.evab_personen importieren
   1. Prüfen, bei welchen Adressen benötigte Felder leer sind (evab_nachname, evab_vorname, evab_ort). Diese ergänzen:
      ```sql
      select name from apflora.adresse
      where
        adresse.evab_id_person IS NULL
        and (
          evab_nachname is null
          or evab_vorname is null
          or evab_ort is null
        )
      order by name;
      ```
   1. In `beob_nach_evab.accdb`, Tabelle `apflora_adresse`: leeren, dann die aktuellen Daten importieren
1. Alle `v_exportevab...` views: In PgAdmin öffnen, als .csv speichern
1. Alle `apflora_v_exportevab...`-Tabellen in `beob_nach_evab.accdb`: leeren, dann aus den views importieren. WICHTIG: Im ersten Dialog in Access UTF-8 einstellen
1. Es braucht in tblPersonen einen Datensatz für Topos (`{7C71B8AF-DF3E-4844-A83B-55735F80B993}	topos Marti & Müller AG	-	Zürich`). Der wird zwar jedes Jahr hinzugefügt, er taucht aber trotzdem nie im Template auf. Daher muss er aus dem Vorjahr hinein kopiert werden
1. Jetzt die Import-Abfragen in `beob_nach_evab.accdb` nacheinander ausführen. Dabei darauf achten, dass immer alle Datensätze importiert wurden. Falls nicht, muss dem nachgegangen werden. Es kann z.B. an veränderten Stammdaten in EvAB liegen
1. `EvabGeoDB_apflora.mdb` ist nun bereit
1. `EvabGeoDB_apflora.mdb` in EvAB öffnen und prüfen, ob es i.O. aussieht
1. `EvabGeoDB_apflora.mdb`: Abfrage `vExportZDSF` nach Excel exportieren: Damit Topos die Daten in Tabellenform prüfen kann
1. `EvabGeoDB_apflora.mdb` und `vExportZDSF.xlsx` Topos zur Prüfung und Weiterleitung an die FNS übermitteln