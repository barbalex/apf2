import { DokuDate } from '../..'
import beobTable from './beobTable.png'

const BeobVerwalten = () => (
  <>
    <h1>Beobachtungen verwalten</h1>
    <DokuDate>27.12.2021</DokuDate>
    <h2>1. Datenstruktur</h2>
    <p>
      Beobachtungen werden in der Tabelle <code>beob</code> gespeichert:
      <br />
      <img src={beobTable} alt="Tabelle beob" />
      <br />
    </p>
    <p>Ein Datensatz besteht aus jeweils zwei Teilen:</p>
    <ol>
      <li>
        Den unveränderten Originaldaten der Beobachtung, enthalten im JSONB-Feld{' '}
        <code>data</code>
      </li>
      <li>
        In den übrigen Feldern: Extrahierten bzw. abgeleiteteten Daten, welche
        für das effiziente Funktionieren von apflora.ch benötigt werden
      </li>
    </ol>
    <p>
      Daten von Info Spezies werden in derjenigen Struktur importiert, wie sie
      von der FNS aufbereitet wurden.
    </p>
    <p>Zweck dieser Datenstruktur:</p>
    <ul>
      <li>
        Die Struktur von Beobachtungsdaten ist im Prinzip unerheblich.
        Änderungen daran auch. Wichtig ist einzig, dass zum Zeitpunkt des
        Imports klar ist, wie aus den Beobachtungsdaten die abgeleiteten Felder
        in Tabelle <code>beob</code> generiert werden können
      </li>
      <li>
        Somit können jederzeit Beobachtungen unabhängig von ihrer Datenstruktur
        importiert werden
      </li>
      <li>
        Schon vorhandene Beobachtungen können bei erneutem Import mit
        aktuelleren ersetzt werden (<code>quelle</code> und{' '}
        <code>id_field</code> vergleichen)
      </li>
      <li>
        Mit Hilfe der abgeleiteten Felder können gebaut werden:
        <ul>
          <li>der Strukturbaum</li>
          <li>das Beobachtungs-Formular</li>
          <li>die Funktion für Meldungen an Info Spezies</li>
        </ul>
      </li>
    </ul>
    <p>Struktur der Tabelle &quot;beob&quot;:</p>
    <ul>
      <li>
        id: id dieser Tabelle. Ohne Bezug zu id&#39;s in den Beobachtungsdaten
      </li>
      <li>data: Unveränderte Originaldaten im JSONB Format</li>
      <li>
        id_field: Feld in den Originaldaten, welches die Original-ID enthält.
        Dient dazu, gemeinsam mit dem Feld <code>quelle</code> jederzeit mit
        neuen Versionen von Originaldaten verbinden zu können
      </li>
      <li>
        obs_id: Wie id_field. Weil ab 2022 Importe sowieso nur von Info Flora
        stammen sollen, dies ihre ID ist und komplexe Abfragen beim Import mit
        Hilfe dieses Feldes vereinfacht und beschleunigt werden
      </li>
      <li>
        quelle: Woher die Beobachtung stammt. Möglichst kurz und klar, ähnlich
        Literaturzitaten. Beispiel: Info Spezies 2017
      </li>
      <li>
        art_id: beschreibt die Art. Fremdschlüssel aus Tabelle{' '}
        <code>ae_taxonomies</code>
      </li>
      <li>
        art_id_original: Am Unterschied zwischen art_id_original und art_id wird
        erkenntlich, wenn die Art-Bestimmung verändert wurde
      </li>
      <li>autor: Autor der Beobachtung</li>
      <li>datum: Datum der Beobachtung</li>
      <li>geom_point: Die Geometrie der Beobachtung</li>
      <li>tpop_id: dieser Teilpopulation wird die Beobachtung zugeordnet</li>
      <li>
        nicht_zuordnen: Ja oder nein. Wird ja gesetzt, wenn eine Beobachtung
        keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld
        begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder
        die Beobachtung ist nicht (genau genug) lokalisierbar
      </li>
      <li>bemerkungen: Bemerkungen zur Zuordnung</li>
      <li>
        infoflora_informiert_datum: Wann ein Email an Info Flora generiert wurde
      </li>
      <li>
        created_at, update_at, changed_by: Dokumentiert die letzte Änderung am
        Datensatz
      </li>
    </ul>
    <h2>2. Beobachtungen von Info Spezies importieren</h2>
    <p>
      Ist in der jeweils aktuellsten Abfrage dokumentiert. Beispiel:{' '}
      <a
        href="https://github.com/barbalex/apf2/blob/master/sql/apflora/import_info_flora/2022-03-30_import_info_flora.sql"
        target="_blank"
        className="url"
        rel="noreferrer"
      >
        https://github.com/barbalex/apf2/blob/master/sql/apflora/import_info_flora/2022-03-30_import_info_flora.sql
      </a>
    </p>
  </>
)

export default BeobVerwalten
