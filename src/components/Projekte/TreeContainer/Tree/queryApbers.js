import gql from 'graphql-tag'

export default gql`
  query ApbersQuery($ap: [UUID!], $isAp: Boolean!) {
    allApbers(filter: { apId: { in: $ap } }, orderBy: LABEL_ASC)
      @include(if: $isAp) {
      nodes {
        id
        apId
        jahr
        label
      }
    }
  }
`
