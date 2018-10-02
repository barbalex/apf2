import gql from 'graphql-tag'

export default gql`
  query view {
    allVApAnzkontrs {
      nodes {
        id
        artname
        bearbeitung
        start_jahr: startJahr
        umsetzung
        anzahl_kontrollen: anzahlKontrollen
      }
    }
  }
`
