import gql from 'graphql-tag'

export default gql`
  query popAnzKontrsQuery {
    allPops {
      nodes {
        id
        vPopAnzkontrsById {
          nodes {
            apId
            artname
            apBearbeitung
            apStartJahr
            apUmsetzung
            id
            nr
            name
            status
            bekanntSeit
            statusUnklar
            statusUnklarBegruendung
            x
            y
            anzahlKontrollen
          }
        }
      }
    }
  }
`
