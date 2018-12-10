import gql from 'graphql-tag'

export default gql`
  query PopsQuery($isAp: Boolean!, $popFilter: PopFilter!) {
    allPops(filter: $popFilter, orderBy: NR_ASC) @include(if: $isAp) {
      nodes {
        id
        apId
        nr
        name
        status
        statusUnklar
        statusUnklarBegruendung
        bekanntSeit
        x
        y
        apByApId {
          id
          bearbeitung
        }
      }
    }
  }
`
