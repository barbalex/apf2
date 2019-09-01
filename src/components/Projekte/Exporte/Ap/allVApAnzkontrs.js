import gql from 'graphql-tag'

export default gql`
  query viewApAnzkontrsForExporte {
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
