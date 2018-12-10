import gql from 'graphql-tag'

export default gql`
  query BersQuery($ap: [UUID!], $isAp: Boolean!) {
    allBers(filter: { apId: { in: $ap } }, orderBy: JAHR_ASC)
      @include(if: $isAp) {
      nodes {
        id
        apId
        jahr
        titel
      }
    }
  }
`
