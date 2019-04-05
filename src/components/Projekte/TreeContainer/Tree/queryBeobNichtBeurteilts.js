import gql from 'graphql-tag'

export default gql`
  query BeobNichtBeurteiltsQuery($filter: BeobFilter, $isAp: Boolean!) {
    allVApbeobs(filter: $filter) @include(if: $isAp) {
      nodes {
        id
        label
        apId
      }
    }
  }
`
