---
typ: 'technDoku'
path: '/Dokumentation/Technisch/Info-Flora-Export'
date: '2021-03-03'
title: 'Info-Flora-Export'
sort: 10
---

Feld- und Freiwilligen-Kontrollen entsprechen Beobachtungen. Ein mal jährlich (ca. im April) werden sie daher an Info Flora exportiert.<br/><br/>

### Folgende Kontrollen werden exportiert

- Art: Grundsätzlich alle. Ausnahmen:
  - Keine Testart
  - Keine von der FNS ergänzte Art
- Teilpopulation:
  - Enthält gültige Koordinaten
  - Enthält einen Flurnamen
  - Ist kein Ansaatversuch
  - Es wurde erfasst, seit wann sie bekannt ist
  - Status ist ursprünglich oder die Ansiedlung ist mindestens 5 Jahre her (= sie ist seit mindestens 5 Jahren bekannt)
- Kontrolle:
  - Ein gültiger Bearbeiter ist erfasst (nicht der Bearbeiter "Unbekannt")
  - Es existiert ein Kontrolljahr. Es liegt vor dem aktuellen (Kontrollen aus dem aktuellen Jahr wurden ev. noch nicht verifiziert)

### Folgende Felder werden exportiert

- `id_projektintern`: id der Kontrolle
- `id_in_evab`: id der Kontrolle, so geschrieben wie sie EvAB erwartete und wie sie früher von EvAB an Info Flora geliefert wurde
- `sisf_nr_2005`: Taxonomie-ID der Pflanzenart. Nach dem Index 2005
- `artname`: Name der Pflanzenart
- `beobachtungstyp`: `O` (Feldbeobachtung)
- `herkunft`:
  - Status ist ursprünglich:
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt, es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt, es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
- `status`: Status der Teilpopulation
- `bekannt_seit`: bekannt_seit der Teilpopulation
- `datum`: Datum der Kontrolle. 1.1. des Jahrs, wenn es nur ein Jahr geben sollte
- `genauigkeit_datum`: `genau`, wenn das Datum genau erfasst wurde. `Jahr`, wenn nur das Jahr existiert
- `genauigkeit_datum_codiert`: `P` (genau), wenn das Datum genau erfasst wurde. `X` (nicht definiert), wenn nur das Jahr existiert
- `praesenz`:
  - Wenn 0 Pflanzen gezählt wurden _und im Jahr der Kontrolle "erloschen" berichtet wurde_: `erloschen/zerstört`
  - Sonst, wenn 0 Pflanzen gezählt wurden: `nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit)`
  - Übrige: `vorhanden`
- `gefaehrdung`: Feld `gefaehrdung` der Kontrolle
- `vitalitaet`: Feld `vitalitaet` der Kontrolle
- `beschreibung`: Feld `beschreibung` der Teilpopulation
- `lebensraum_nach_delarze`: LR-Typ nach Delarze
- `umgebung_nach_delarze`: LR-Typ der Umgebung nach Delarze
- `deckung_moosschicht`: Feld `moosschicht` der Kontrolle
- `deckung_krautschicht`: Feld `krautschicht` der Kontrolle
- `deckung_strauchschicht`: Feld `strauchschicht` der Kontrolle
- `deckung_baumschicht`: Feld `baumschicht` der Kontrolle
- `genauigkeit_lage`: ± 25m
- `geometry_type`: Point
- `genauigkeit_hoehe`: X (Nicht definiert)
- `obergrenze_hoehe`: Feld `hoehe` der Teilpopulation
- `x`: X-Koordinate der Teilpopulation
- `y`: Y-Koordinate der Teilpopulation
- `gemeinde`: Gemeinde der Teilpopulation
- `flurname`: Flurname der Teilpopulation
- `zaehlungen`: Anzahlen, Zähleinheiten und Methoden aller Zählungen werden kommagetrennt gelistet
- `expertise_introduit` ist `C` (von einen Gutachter definiert)
- `expertise_introduite_nom` ist der AP-Verantwortliche oder - bei dessen Fehlen - Topos
- `projekt`: AP Flora ZH
- `aktionsplan`: Bearbeitungsstand, Startjahr und Umsetzungsstand des Aktionsplans (sofern vorhanden)
