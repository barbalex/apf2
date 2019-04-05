import gql from 'graphql-tag'

export default gql`
  query BeobNichtZuzuordnensQuery($filter: VApbeobFilter, $isAp: Boolean!) {
    allVApbeobs(filter: $filter) @include(if: $isAp) {
      nodes {
        id
        label
        apId
        artId
      }
    }
  }
`
