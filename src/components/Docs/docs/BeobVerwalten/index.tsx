import desktopStyles from '../../DesktopDocs.module.css'
import beobTable from './beobTable.webp'

export const Component = () => (
  <>
    <h1>Beobachtungen verwalten</h1>
    <p className={desktopStyles.dokuDate}>16.04.2023</p>
    <h2>1. Datenstruktur</h2>
    <p>
      Beobachtungen werden in der Tabelle{' '}
      <code className={desktopStyles.code}>beob</code> gespeichert:
      <br />
      <img
        src={beobTable}
        alt="Tabelle beob"
        width="280"
        height="575"
      />
      <br />
    </p>
    <p>Ein Datensatz besteht aus jeweils zwei Teilen:</p>
    <ol>
      <li>
        Den unveränderten Originaldaten der Beobachtung, enthalten im JSONB-Feld{' '}
        <code className={desktopStyles.code}>data</code>
      </li>
      <li>
        In den übrigen Feldern: Extrahierten bzw. abgeleiteteten Daten, welche
        für das effiziente Funktionieren von apflora.ch benötigt werden
      </li>
    </ol>
    <p>
      Daten von Info Spezies werden in derjenigen Struktur importiert, in der
      sie geliefert werden.
    </p>
    <p>Zweck dieser Datenstruktur:</p>
    <ul>
      <li>
        Die Struktur von Beobachtungsdaten ist im Prinzip unerheblich.
        Änderungen daran auch. Wichtig ist einzig, dass zum Zeitpunkt des
        Imports klar ist, wie aus den Beobachtungsdaten die abgeleiteten Felder
        in Tabelle <code className={desktopStyles.code}>beob</code> generiert
        werden können
      </li>
      <li>
        Somit können jederzeit Beobachtungen unabhängig von ihrer Datenstruktur
        importiert werden
      </li>
      <li>
        Schon vorhandene Beobachtungen können bei erneutem Import mit
        aktuelleren ersetzt werden (
        <code className={desktopStyles.code}>quelle</code> und{' '}
        <code className={desktopStyles.code}>id_field</code> vergleichen)
      </li>
      <li>
        Mit Hilfe der abgeleiteten Felder können gebaut werden:
        <ul>
          <li>der Navigationsbaum</li>
          <li>das Beobachtungs-Formular</li>
          <li>Popup-Formulare in der Karte</li>
          <li>die Funktion für Meldungen an Info Spezies</li>
        </ul>
      </li>
    </ul>
    <p>Felder der Tabelle &quot;beob&quot;:</p>
    <ul>
      <li>
        <code className={desktopStyles.code}>id</code>: id dieser Tabelle. Ohne
        Bezug zu id&#39;s in den Beobachtungsdaten
      </li>
      <li>
        <code className={desktopStyles.code}>data</code>: Unveränderte
        Originaldaten im JSONB Format
      </li>
      <li>
        <code className={desktopStyles.code}>id_field</code>: Feld in den
        Originaldaten, welches die Original-ID enthält. Dient dazu, gemeinsam
        mit dem Feld <code className={desktopStyles.code}>quelle</code>{' '}
        jederzeit mit neuen Versionen von Originaldaten verbinden zu können.
        Extrahiert, um Beobachtungen bei re-Importen effizient aktualisieren zu
        können
      </li>
      <li>
        <code className={desktopStyles.code}>obs_id</code>: Wie id_field. Weil
        ab 2022 Importe sowieso nur von Info Flora stammen sollen, dies ihre ID
        ist und komplexe Abfragen beim Import mit Hilfe dieses Feldes
        vereinfacht und beschleunigt werden. Extrahiert, um Beobachtungen bei
        re-Importen effizient aktualisieren zu können
      </li>
      <li>
        <code className={desktopStyles.code}>quelle</code>
        {`: Woher die Beobachtung stammt. Möglichst kurz und klar, ähnlich
        Literaturzitaten. Beispiel: "Info Spezies 2017". Extrahiert, um Beobachtungen effizient beschriften zu können`}
      </li>
      <li>
        <code className={desktopStyles.code}>art_id</code>: beschreibt die Art.
        Fremdschlüssel aus Tabelle{' '}
        <code className={desktopStyles.code}>ae_taxonomies</code>. Extrahiert,
        um Beobachtungen effizient beschriften zu können
      </li>
      <li>
        <code className={desktopStyles.code}>art_id_original</code>: Am
        Unterschied zwischen art_id_original (unverändert) und art_id
        (verändert) wird erkenntlich, wenn die Zuordnung des Taxon verändert
        wurde. Extrahiert, um Taxon-Änderungen effizient abfragen zu können
      </li>
      <li>
        <code className={desktopStyles.code}>autor</code>: Autor der
        Beobachtung. Extrahiert, um Beobachtungen effizient beschriften zu
        können
      </li>
      <li>
        <code className={desktopStyles.code}>datum</code>: Datum der
        Beobachtung. Extrahiert, um Beobachtungen effizient beschriften zu
        können
      </li>
      <li>
        <code className={desktopStyles.code}>geom_point</code>: Die Geometrie
        der Beobachtung. Extrahiert, um Beobachtungen effizient in Karten
        anzeigen zu können
      </li>
      <li>
        <code className={desktopStyles.code}>tpop_id</code>
        {`: dieser Teilpopulation wird die Beobachtung
        zugeordnet`}
      </li>
      <li>
        <code className={desktopStyles.code}>nicht_zuordnen</code>
        {`: "Ja" oder "nein". Wird "ja" gesetzt, wenn eine Beobachtung
        keiner Teilpopulation zugeordnet werden kann. Sollte im Bemerkungsfeld
        begründet werden. In der Regel ist die Artbestimmung zweifelhaft. Oder
        die Beobachtung ist nicht (genau genug) lokalisierbar`}
      </li>
      <li>
        <code className={desktopStyles.code}>bemerkungen</code>: Bemerkungen zur
        Zuordnung
      </li>
      <li>
        <code className={desktopStyles.code}>infoflora_informiert_datum</code>:
        Wann ein Email an Info Flora generiert wurde
      </li>
      <li>
        <code className={desktopStyles.code}>created_at</code>,{' '}
        <code className={desktopStyles.code}>update_at</code>,{' '}
        <code className={desktopStyles.code}>changed_by</code>: Dokumentiert die
        letzte Änderung am Datensatz
      </li>
      <li>
        {`id_evab, id_evab_lc: Relikte aus der Zeit, als Beobachtungen aus EvAB
        importiert werden mussten. Die lc-Variante steht für lower case und wurde generiert, damit eine GUID wirklich immer gleich ist. Wieso? Weil aus EvAB GUID's manchmal upper-case und manchmal lower-case ankamen, womit dieselbe GUID nicht immer gleich war...`}
      </li>
    </ul>
    <h2>2. Beobachtungen importieren</h2>
    <p>Folgende Import wurden bisher durchgeführt:</p>
    <ul>
      <li>EvAB 2016: 228'791</li>
      <li>Info Flora 2017: 192'606</li>
      <li>FloZ 2017: 30'935</li>
      <li>Info Flora 2021.05: 17'638</li>
      <li>Info Flora 2022.03: 15'012</li>
      <li>Info Flora 2022.12 gesamt: 3'029</li>
      <li>Info Flora 2022.01: 459</li>
      <li>Info Flora 2023.02 Utricularia: 215</li>
      <li>Info Flora 2022.08: 208</li>
      <li>Info Flora 2022.04: 87</li>
      <li>Info Flora 2022.12 Auszug: 16</li>
    </ul>
    <p>
      {`Künftig sollen Importe nur noch von Info Flora erfolgen. Grund: Alle
      Beobachtungen sollten Info Flora gemeldet werden. Will heissen: Zuvor auf
      anderem Weg importierte Beobachtungen werden später nochmals über Info
      Flora importiert. Leider liefert Info Flora Original-ID's nicht
      zuverlässig mit. Womit nicht sichergestellt werden kann, dass dieselbe
      Beobachtung mehrfach importiert wird. Konkret können wir bei den
      FloZ-Daten nicht 100% sicher sein, dass dies nicht passiert ist.`}
    </p>
    <p>
      {`Der eigentliche Importvorgang in der jeweils aktuellsten Abfrage
      dokumentiert. Beispiel: `}
      <a
        href="https://github.com/barbalex/apf2/blob/master/sql/apflora/import_info_flora/2023-02-10.sql"
        target="_blank"
        className="url"
        rel="noreferrer"
      >
        https://github.com/barbalex/apf2/blob/master/sql/apflora/import_info_flora/2023-02-10.sql
      </a>
    </p>
    <p>
      {`Wenn Beobachtungen importiert werden, werden jeweils die Daten bereits
      früher importierter aktualisiert. Ein Teil der Daten werden extrahiert, um
      die Beobachtungen effizienter darstellen zu können (Taxon, Autor, Datum,
      ID-Feld, Koordinaten). Sie werden bei jedem Import aktualisiert. Solltet
      ihr also Diskrepanzen zwischen den Angaben im Formular und den
      Beschriftungen in Navigationsbaum und Karte oder der Darstellung auf der
      Karte feststellen, meldet das bitte.`}
    </p>
    <p>
      {`Ausserdem können wir beim Import Listen erstellen, wo wesentliche
      Änderungen an den erwähnten Daten durch Info Flora vorgenommen wurden
      (v.a. Taxon, Datum und Koordinaten).`}
    </p>
  </>
)
