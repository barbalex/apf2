import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltsQuery($filter: VApbeobFilter, $isAp: Boolean!) {
    allVApbeobs(filter: $filter) @include(if: $isAp) {
      nodes {
        id
        label
        apId
      }
    }
  }
`
