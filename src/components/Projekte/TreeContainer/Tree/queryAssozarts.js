import gql from 'graphql-tag'

export default gql`
  query AssozartsQuery($ap: [UUID!], $isAp: Boolean!) {
    allAssozarts(filter: { apId: { in: $ap } }) @include(if: $isAp) {
      nodes {
        id
        apId
        aeId
        aeEigenschaftenByAeId {
          id
          artname
        }
      }
    }
  }
`
