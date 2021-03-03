DROP VIEW IF EXISTS apflora.v_export_info_flora_beob CASCADE;
CREATE OR REPLACE VIEW apflora.v_export_info_flora_beob AS
with kontrolle_mit_groesster_anzahl as (
  SELECT distinct on (kontr0.id)
    kontr0.id,
    zaehl0.anzahl
  FROM
    apflora.tpopkontr kontr0
    INNER JOIN apflora.tpopkontrzaehl zaehl0
    ON kontr0.id = zaehl0.tpopkontr_id
  order by
    kontr0.id,
    zaehl0.anzahl desc
)
SELECT
  kontr.id as id_projektintern,
  concat('{', upper(kontr.id::text), '}') as id_in_evab,
  tax.taxid as sisf_nr_2005,
  tax.artname as artname,
  'Feldbeobachtung' AS beobachtungstyp,
  'O' AS beobachtungstyp_codiert,
  /*
  Status in EvAB (offizielle Ansiedlung / inoffiziell):
  - Status ist ursprünglich (< 200):
    4 (N) (Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten))
  - Vor der Kontrolle existiert eine Ansiedlung:
    6 (R) (Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist unklar:
    3 (I) (Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten)
    Ideal wäre: Neues Feld Herkunft uklar, Anwesenheit unklar. Hier nur Herkunft berücksichtigen
  - Status ist angesiedelt (>= 200), es gibt keine Ansiedlung und Status ist klar:
    5 (O) (Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
  */
   CASE
    WHEN tpop.status < 200 THEN 'Natürliches Vorkommen (indigene Arten) oder eingebürgertes Vorkommen (Neophyten)'
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = kontr.tpop_id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= kontr.jahr
    ) THEN 'Offizielle Wiederansiedlung/Populationsverstärkung (Herkunft bekannt)'
    WHEN tpop.status_unklar = true THEN 'Herkunft unklar, Verdacht auf Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen unterstütztes Auftreten'
    ELSE 'Inoffizielle Ansiedlung (offensichtlich gepflanzt/angesalbt oder eingesät, Herkunft unbekannt)'
  END AS introduit,
   CASE
    WHEN tpop.status < 200 THEN 'N'
    WHEN EXISTS(
      SELECT
        apflora.tpopmassn.tpop_id
      FROM
        apflora.tpopmassn
      WHERE
        apflora.tpopmassn.tpop_id = kontr.tpop_id
        AND apflora.tpopmassn.typ BETWEEN 1 AND 3
        AND apflora.tpopmassn.jahr <= kontr.jahr
    ) THEN 'R'
    WHEN tpop.status_unklar = true THEN 'I'
    ELSE 'O'
  END AS introduit_codiert,
  apflora.pop_status_werte.text as status,
  tpop.bekannt_seit as bekannt_seit,
  CASE
    WHEN kontr.datum IS NOT NULL
    THEN to_char(kontr.datum, 'DD.MM.YYYY')
    ELSE
      concat(
        '01.01.',
        kontr.jahr
      )
  END AS datum,
  CASE
    WHEN kontr.datum IS NOT NULL
    THEN 'genau'
    ELSE 'Jahr'
  END AS genauigkeit_datum,
  CASE
    WHEN kontr.datum IS NOT NULL
    THEN 'P'
    ELSE 'X'
  END AS genauigkeit_datum_codiert,
  /*
  Präsenz:
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr erloschen meldet:
    2 (erloschen/zerstört)
  - wenn 0 gezählt wurden und der Bericht aus demselben Jahr nicht erloschen meldet:
    3 (nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit))
  - sonst
    1 (vorhanden)
  */
  CASE
    WHEN (
      kontrolle_mit_groesster_anzahl.anzahl = 0
      AND EXISTS (
        SELECT
          tpop_id
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber.tpop_id = kontr.tpop_id
          AND apflora.tpopber.entwicklung = 8
          AND apflora.tpopber.jahr = kontr.jahr
      )
    ) THEN 'erloschen/zerstört'
    WHEN kontrolle_mit_groesster_anzahl.anzahl = 0 THEN 'nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit)'
    ELSE 'vorhanden'
  END AS praesenz,
  CASE
    WHEN (
      kontrolle_mit_groesster_anzahl.anzahl = 0
      AND EXISTS (
        SELECT
          tpop_id
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber.tpop_id = kontr.tpop_id
          AND apflora.tpopber.entwicklung = 8
          AND apflora.tpopber.jahr = kontr.jahr
      )
    ) THEN '-'
    WHEN kontrolle_mit_groesster_anzahl.anzahl = 0 THEN 'N'
    ELSE '+'
  END AS praesenz_codiert,
  kontr.gefaehrdung AS gefaehrdung,
  kontr.vitalitaet AS vitalitaet,
  tpop.beschreibung AS beschreibung,
  kontr.lr_delarze as lebensraum_nach_delarze,
  kontr.lr_umgebung_delarze as umgebung_nach_delarze,
  kontr.moosschicht as deckung_moosschicht,
  kontr.krautschicht as deckung_krautschicht,
  kontr.strauchschicht as deckung_strauchschicht,
  kontr.baumschicht as deckung_baumschicht,
  '± 25m' as genauigkeit_lage,
  'A' as genauigkeit_lage_codiert,
  'Point' as geometry_type,
  'X (Nicht definiert)' as genauigkeit_hoehe,
  tpop.lv95_x AS x,
  tpop.lv95_y AS y,
  tpop.gemeinde as gemeinde,
  tpop.flurname as flurname,
  CASE
    WHEN tpop.hoehe IS NOT NULL
    THEN tpop.hoehe
    ELSE 0
  END AS obergrenze_hoehe,
  /*
   * Zählungen auswerten für ABONDANCE
   */
  concat(
    'Anzahlen: ',
    array_to_string(array_agg(zaehl.anzahl), ', '),
    ', Zaehleinheiten: ',
    string_agg(apflora.tpopkontrzaehl_einheit_werte.text, ', '),
    ', Methoden: ',
    string_agg(apflora.tpopkontrzaehl_methode_werte.text, ', ')
    ) AS zaehlungen,
  'C'::TEXT AS expertise_introduit,
  /*
   * AP-Verantwortliche oder topos als EXPERTISE_INTRODUITE_NOM setzen
   */
  CASE
    WHEN ap_bearbeiter_adresse.name IS NOT NULL
    THEN ap_bearbeiter_adresse.name
    ELSE 'topos Marti & Müller AG Zürich'
  END AS expertise_introduite_nom,
  'AP Flora ZH' AS projekt,
  concat(
    CASE
      WHEN apflora.ap_bearbstand_werte.text IS NOT NULL
      THEN concat('Aktionsplan: ', apflora.ap_bearbstand_werte.text)
      ELSE 'Aktionsplan: (keine Angabe)'
    END,
    CASE
      WHEN ap.start_jahr IS NOT NULL
      THEN concat('; Start im Jahr: ', ap.start_jahr)
      ELSE ''
    END,
    CASE
      WHEN ap.umsetzung IS NOT NULL
      THEN concat('; Stand Umsetzung: ', apflora.ap_umsetzung_werte.text)
      ELSE ''
    END,
    ''
  ) AS aktionsplan
FROM
  apflora.ap ap
  LEFT JOIN
    apflora.adresse AS ap_bearbeiter_adresse
    ON ap.bearbeiter = ap_bearbeiter_adresse.id
  LEFT JOIN
    apflora.ap_bearbstand_werte
    ON ap.bearbeitung = apflora.ap_bearbstand_werte.code
  LEFT JOIN
    apflora.ap_umsetzung_werte
    ON ap.umsetzung = apflora.ap_umsetzung_werte.code
  INNER JOIN
    apflora.ae_taxonomies tax
    ON ap.art_id = tax.id
  INNER JOIN
    apflora.pop pop
    INNER JOIN
      apflora.tpop tpop
      LEFT JOIN
        apflora.pop_status_werte
        ON tpop.status = apflora.pop_status_werte.code
      INNER JOIN
        apflora.tpopkontr kontr
        INNER JOIN
          kontrolle_mit_groesster_anzahl
          ON kontrolle_mit_groesster_anzahl.id = kontr.id
        LEFT JOIN
          apflora.tpopkontrzaehl zaehl
          LEFT JOIN
            apflora.tpopkontrzaehl_einheit_werte
            ON zaehl.einheit = apflora.tpopkontrzaehl_einheit_werte.code
          LEFT JOIN
            apflora.tpopkontrzaehl_methode_werte
            ON zaehl.methode = apflora.tpopkontrzaehl_methode_werte.code
          ON kontr.id = zaehl.tpopkontr_id
        ON tpop.id = kontr.tpop_id
      ON pop.id = tpop.pop_id
    ON ap.id = pop.ap_id
WHERE
  -- keine Testarten
  tax.taxid > 150
  AND tax.taxid < 1000000
  -- nur Kontrollen, deren Teilpopulationen Koordinaten besitzen
  AND tpop.lv95_x IS NOT NULL
  AND kontr.typ IN ('Ausgangszustand', 'Zwischenbeurteilung', 'Freiwilligen-Erfolgskontrolle')
  -- keine Ansaatversuche
  AND tpop.status <> 201
  -- nur wenn die Kontrolle einen bearbeiter hat
  AND kontr.bearbeiter IS NOT NULL
  -- ...und nicht unbekannt ist
  AND kontr.bearbeiter <> 'a1146ae4-4e03-4032-8aa8-bc46ba02f468'
  -- nur wenn Kontrolljahr existiert
  AND kontr.jahr IS NOT NULL
  -- keine Kontrollen aus dem aktuellen Jahr - die wurden ev. noch nicht verifiziert
  AND kontr.jahr <> date_part('year', CURRENT_DATE)
  -- nur wenn erfasst ist, seit wann die TPop bekannt ist
  AND tpop.bekannt_seit IS NOT NULL
  AND (
    -- die Teilpopulation ist ursprünglich
    tpop.status IN (100, 101)
    -- oder bei Ansiedlungen: die Art war mindestens 5 Jahre vorhanden
    OR (kontr.jahr - tpop.bekannt_seit) > 5
  )
  AND tpop.flurname IS NOT NULL
-- grouping is necessary because zaehlungen are concatted
GROUP BY
  ap.id,
  ap_bearbeiter_adresse.name,
  tax.taxid,
  tax.artname,
  ap_bearbstand_werte.text,
  ap_umsetzung_werte.text,
  tpop.status,
  tpop.status_unklar,
  pop_status_werte.text,
  tpop.bekannt_seit,
  tpop.hoehe,
  tpop.lv95_x,
  tpop.lv95_y,
  tpop.gemeinde,
  tpop.flurname,
  tpop.beschreibung,
  kontrolle_mit_groesster_anzahl.anzahl,
  kontr.id,
  kontr.zeit_id,
  kontr.tpop_id,
  kontr.jahr,
  kontr.gefaehrdung,
  kontr.vitalitaet,
  kontr.datum,
  kontr.moosschicht,
  kontr.krautschicht,
  kontr.strauchschicht,
  kontr.baumschicht
order BY
  tax.artname,
  kontr.datum;