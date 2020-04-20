import gql from 'graphql-tag'

export default gql`
  query popOhneKoordsQuery {
    allPops(filter: { vPopOhnekoordsByIdExist: true }) {
      nodes {
        id
        vPopOhnekoordsById {
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
            changed
            changedBy
          }
        }
      }
    }
  }
`
