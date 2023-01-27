import { DokuDate } from '..'

const ArtTaxonomieErgaenzen = () => (
  <>
    <h1>Art-Taxonomien ergänzen</h1>
    <DokuDate>27.12.2021</DokuDate>
    <h3>Herkunft der Art-Listen</h3>
    <p>
      Artenlisten stammen aus{' '}
      <a href="https://arteigenschaften.ch" target="_blank" rel="noreferrer">
        arteigenschaften.ch
      </a>
      . Momentan werden die Arten aus den Taxonomien{' '}
      <a
        href="https://arteigenschaften.ch/Arten/aed47d41-7b0e-11e8-b9a5-bd4f79edbcc4"
        target="_blank"
        rel="noreferrer"
      >
        &quot;SISF (2005)&quot;
      </a>{' '}
      und{' '}
      <a
        href="https://arteigenschaften.ch/Arten/c87f19f2-1b77-11ea-8282-bbc40e20aff6"
        target="_blank"
        rel="noreferrer"
      >
        &quot;DB-TAXREF (2017)&quot;
      </a>{' '}
      verwendet.
    </p>
    <h3>Rolle der Taxonomie in der Art-Auswahl</h3>
    <p>Arten können in drei Formularen gewählt werden:</p>
    <ul>
      <li>Art</li>
      <li>Taxon</li>
      <li>assoziierte Art</li>
    </ul>
    <p>
      In der Regel sollten Arten aus der aktuellen Taxonomie &quot;DB-TAXREF
      (2017)&quot; gewählt werden. Bei den AP-Arten ist es sinnvoll, Synonyme
      aus allen gängigen Taxonomien aufzulisten.
    </p>
    <p>
      Damit bei der Art-Auswahl die Taxonomie berücksichtigt werden kann, wird
      der Art ein Kürzel für die Taxonomie vorangestellt. Für &quot;SISF Index 2
      (2005)&quot; ist das zum Beispiel &quot;Info Flora 2005&quot;.
    </p>
    <h3>Technische Umsetzung</h3>
    <p>
      apflora ist auf künftige Indizes vorbereitet. Es muss einzig die
      Artenliste um den neuen Index ergänzt werden. Anschliessend können in den
      Formularen (oder mittels Abfragen) die Arten des neuen Index gewählt
      werden.
    </p>
    <p>
      Die Artliste wird von arteigenschaften.ch importiert und in der Tabelle{' '}
      <a
        href="https://github.com/barbalex/apf2/blob/master/sql/apflora/createTables.sql#L2447-L2465"
        target="_blank"
        rel="noreferrer"
      >
        &quot;ae_taxonomies&quot;
      </a>{' '}
      gespeichert. Leider kann keine foreign table verwendet werden, weil die
      Beziehungen wichtig für die Referenzierung der Namen sind.
    </p>
    <p>
      Mehr Informationen{' '}
      <a
        href="https://github.com/barbalex/apf2/issues/230"
        target="_blank"
        rel="noreferrer"
      >
        im entsprechenden Issue
      </a>
      .
    </p>
  </>
)

export default ArtTaxonomieErgaenzen
