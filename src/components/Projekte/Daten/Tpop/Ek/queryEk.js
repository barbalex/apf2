import { gql } from '@apollo/client'

export default gql`
  query TpopEkQuery($id: UUID!, $isEk: Boolean!) {
    allEkplans(filter: { tpopId: { equalTo: $id } }) @include(if: $isEk) {
      nodes {
        id
        jahr
        typ
      }
    }
    allTpopkontrs(filter: { tpopId: { equalTo: $id } }) @include(if: $isEk) {
      nodes {
        id
        jahr
        typ
      }
    }
  }
`
