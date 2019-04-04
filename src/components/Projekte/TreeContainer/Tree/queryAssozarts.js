import gql from 'graphql-tag'

export default gql`
  query AssozartsQuery($ap: [UUID!], $isAp: Boolean!) {
    allAssozarts(filter: { apId: { in: $ap } }, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        id
        label
        apId
        aeId
      }
    }
  }
`
