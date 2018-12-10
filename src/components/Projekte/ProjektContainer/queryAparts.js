import gql from 'graphql-tag'

export default gql`
  query ApartsQuery($ap: [UUID!], $isAp: Boolean!) {
    aparts: allAparts(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        aeEigenschaftenByArtId {
          id
          artname
        }
      }
    }
  }
`
