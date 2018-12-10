import gql from 'graphql-tag'

export default gql`
  query ApbersQuery($ap: [UUID!], $isAp: Boolean!) {
    apbers: allApbers(filter: { apId: { in: $ap } }, orderBy: JAHR_ASC)
      @include(if: $isAp) {
      nodes {
        id
        apId
        jahr
      }
    }
  }
`
