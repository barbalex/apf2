import { DokuDate } from '..'

const InfoFloraExport = () => (
  <>
    <h1>Info-Flora-Export</h1>
    <DokuDate>31.03.2022</DokuDate>
    <p>
      Feld- und Freiwilligen-Kontrollen entsprechen Beobachtungen. Ein mal
      jährlich (ca. im April) werden sie an Info Flora exportiert.
    </p>
    <h3>Folgende Kontrollen werden exportiert</h3>
    <ul>
      <li>
        Art: Grundsätzlich alle. Ausnahmen:
        <ul>
          <li>Keine Testart</li>
          <li>Keine von der FNS ergänzte Art</li>
        </ul>
      </li>
      <li>
        Teilpopulation:
        <ul>
          <li>Enthält gültige Koordinaten</li>
          <li>Enthält einen Flurnamen</li>
          <li>Ist kein Ansaatversuch</li>
          <li>Es wurde erfasst, seit wann sie bekannt ist</li>
          <li>
            Status ist ursprünglich oder die Ansiedlung ist mindestens 5 Jahre
            her (= sie ist seit mindestens 5 Jahren bekannt)
          </li>
        </ul>
      </li>
      <li>
        Kontrolle:
        <ul>
          <li>
            Ein gültiger Bearbeiter ist erfasst (nicht der Bearbeiter
            &quot;Unbekannt&quot;)
          </li>
          <li>
            Es existiert ein Kontrolljahr. Es liegt vor dem aktuellen
            (Kontrollen aus dem aktuellen Jahr wurden ev. noch nicht
            verifiziert)
          </li>
          <li>
            Es werden immer alle exportiert. Info Flora kann selber bestimmen,
            was sie mit früher bereits gelieferten machen will (erkennbar an{' '}
            <code>id_projektintern</code>)
          </li>
        </ul>
      </li>
    </ul>
    <h3>Folgende Felder werden exportiert</h3>
    <ul>
      <li>
        <code>id_projektintern</code>: id der Kontrolle
      </li>
      <li>
        <code>id_in_evab</code>: id der Kontrolle, so geschrieben wie sie EvAB
        erwartete und wie sie früher von EvAB an Info Flora geliefert wurde
      </li>
      <li>
        <code>taxonomie_id</code>: ID der Pflanzenart in der verwendeten
        Taxonomie
      </li>
      <li>
        <code>taxonomie</code>: Welche Taxonomie für die Pflanzenart verwendet
        wird.
        <br />
        Bei AP-Arten sollte das normalerweise <code>DB-TAXREF (2017)</code>{' '}
        sein, die übrigen sind meist noch auf <code>SISF (2005)</code>
      </li>
      <li>
        <code>artname</code>: Name der Pflanzenart
      </li>
      <li>
        <code>beobachtungstyp</code>: <code>O</code> (Feldbeobachtung)
      </li>
      <li>
        <code>herkunft</code>:
        <ul>
          <li>
            Status ist ursprünglich: 4 (N) (Natürliches Vorkommen (indigene
            Arten) oder eingebürgertes Vorkommen (Neophyten))
          </li>
          <li>
            Vor der Kontrolle existiert eine Ansiedlung: 6 (R) (Offizielle
            Wiederansiedlung/Populationsverstärkung (Herkunft bekannt))
          </li>
          <li>
            Status ist angesiedelt, es gibt keine Ansiedlung und Status ist
            unklar: 3 (I) (Herkunft unklar, Verdacht auf
            Ansiedlung/Ansalbung,Einsaat/Anpflanzung oder sonstwie anthropogen
            unterstütztes Auftreten) Ideal wäre: Neues Feld Herkunft uklar,
            Anwesenheit unklar. Hier nur Herkunft berücksichtigen
          </li>
          <li>
            Status ist angesiedelt, es gibt keine Ansiedlung und Status ist
            klar: 5 (O) (Inoffizielle Ansiedlung (offensichtlich
            gepflanzt/angesalbt oder eingesät, Herkunft unbekannt))
          </li>
        </ul>
      </li>
      <li>
        <code>status</code>: Status der Teilpopulation
      </li>
      <li>
        <code>bekannt_seit</code>: bekannt_seit der Teilpopulation
      </li>
      <li>
        <code>datum</code>: Datum der Kontrolle. 1.1. des Jahrs, wenn es nur ein
        Jahr geben sollte
      </li>
      <li>
        <code>genauigkeit_datum</code>: <code>genau</code>, wenn das Datum genau
        erfasst wurde. <code>Jahr</code>, wenn nur das Jahr existiert
      </li>
      <li>
        <code>genauigkeit_datum_codiert</code>: <code>P</code> (genau), wenn das
        Datum genau erfasst wurde. <code>X</code> (nicht definiert), wenn nur
        das Jahr existiert
      </li>
      <li>
        <code>praesenz</code>:
        <ul>
          <li>
            Wenn 0 Pflanzen gezählt wurden{' '}
            <em>
              und im Jahr der Kontrolle &quot;erloschen&quot; berichtet wurde
            </em>
            : <code>erloschen/zerstört</code>
          </li>
          <li>
            Sonst, wenn 0 Pflanzen gezählt wurden:{' '}
            <code>
              nicht festgestellt/gesehen (ohne Angabe der Wahrscheinlichkeit)
            </code>
          </li>
          <li>
            Übrige: <code>vorhanden</code>
          </li>
        </ul>
      </li>
      <li>
        <code>gefaehrdung</code>: Feld <code>gefaehrdung</code> der Kontrolle
      </li>
      <li>
        <code>vitalitaet</code>: Feld <code>vitalitaet</code> der Kontrolle
      </li>
      <li>
        <code>beschreibung</code>: Feld <code>beschreibung</code> der
        Teilpopulation
      </li>
      <li>
        <code>lebensraum_nach_delarze</code>: LR-Typ nach Delarze
      </li>
      <li>
        <code>umgebung_nach_delarze</code>: LR-Typ der Umgebung nach Delarze
      </li>
      <li>
        <code>deckung_moosschicht</code>: Feld <code>moosschicht</code> der
        Kontrolle
      </li>
      <li>
        <code>deckung_krautschicht</code>: Feld <code>krautschicht</code> der
        Kontrolle
      </li>
      <li>
        <code>deckung_strauchschicht</code>: Feld <code>strauchschicht</code>{' '}
        der Kontrolle
      </li>
      <li>
        <code>deckung_baumschicht</code>: Feld <code>baumschicht</code> der
        Kontrolle
      </li>
      <li>
        <code>genauigkeit_lage</code>: ± 25m
      </li>
      <li>
        <code>geometry_type</code>: Point
      </li>
      <li>
        <code>genauigkeit_hoehe</code>: X (Nicht definiert)
      </li>
      <li>
        <code>obergrenze_hoehe</code>: Feld <code>hoehe</code> der
        Teilpopulation
      </li>
      <li>
        <code>x</code>: X-Koordinate der Teilpopulation
      </li>
      <li>
        <code>y</code>: Y-Koordinate der Teilpopulation
      </li>
      <li>
        <code>gemeinde</code>: Gemeinde der Teilpopulation
      </li>
      <li>
        <code>flurname</code>: Flurname der Teilpopulation
      </li>
      <li>
        <code>zaehlungen</code>: Anzahlen, Zähleinheiten und Methoden aller
        Zählungen werden kommagetrennt gelistet
      </li>
      <li>
        <code>expertise_introduit</code> ist <code>C</code> (von einen Gutachter
        definiert)
      </li>
      <li>
        <code>expertise_introduite_nom</code> ist der AP-Verantwortliche oder -
        bei dessen Fehlen - Topos
      </li>
      <li>
        <code>projekt</code>: AP Flora ZH
      </li>
      <li>
        <code>aktionsplan</code>: Bearbeitungsstand, Startjahr und
        Umsetzungsstand des Aktionsplans (sofern vorhanden)
      </li>
    </ul>
    <h3>Ich will es genauer wissen</h3>
    <p>
      O.k., selber schuld 😉:{' '}
      <a
        href="https://github.com/barbalex/apf2/blob/master/sql/apflora/export_info_flora/2022-04-12_export_info_flora.sql"
        target="_blank"
        className="url"
        rel="noreferrer"
      >
        https://github.com/barbalex/apf2/blob/master/sql/apflora/export_info_flora/2022-04-12_export_info_flora.sql
      </a>
    </p>
  </>
)

export default InfoFloraExport
