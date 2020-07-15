import { gql } from '@apollo/client'

export default gql`
  query popAnzMassnsQuery {
    allPops {
      nodes {
        id
        vPopAnzmassnsById {
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
            anzahlMassnahmen
          }
        }
      }
    }
  }
`
