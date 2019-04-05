import gql from 'graphql-tag'

export default gql`
  query BeobZugeordnetsQuery($filter: VApbeobFilter!, $isTpop: Boolean!) {
    allVApbeobs(filter: $filter) @include(if: $isTpop) {
      nodes {
        id
        label
        tpopId
        artId
      }
    }
  }
`
