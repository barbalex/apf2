import gql from 'graphql-tag'

export default gql`
  query viewApAnzmassnsForExporte {
    allVApAnzmassns {
      nodes {
        id
        artname
        bearbeitung
        start_jahr: startJahr
        umsetzung
        anzahl_massnahmen: anzahlMassnahmen
      }
    }
  }
`
