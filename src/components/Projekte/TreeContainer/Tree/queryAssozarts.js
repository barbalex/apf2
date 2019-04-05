import gql from 'graphql-tag'

export default gql`
  query AssozartsQuery($filter: AssozartFilter!, $isAp: Boolean!) {
    allAssozarts(filter: $filter, orderBy: LABEL_ASC) @include(if: $isAp) {
      nodes {
        id
        label
        apId
        aeId
      }
    }
  }
`
