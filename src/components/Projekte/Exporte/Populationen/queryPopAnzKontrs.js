import { gql } from '@apollo/client'

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
