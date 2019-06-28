import gql from 'graphql-tag'

export default gql`
  query EkplanTpopQuery($id: UUID!, $isEk: Boolean!) {
    allEkplans(
      filter: { tpopkontrByTpopkontrId: { tpopId: { equalTo: $id } } }
    ) @include(if: $isEk) {
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
