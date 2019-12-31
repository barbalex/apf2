import gql from 'graphql-tag'

export default gql`
  query TreeBeobZugeordnetsQuery($filter: VApbeobFilter!, $isTpop: Boolean!) {
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
