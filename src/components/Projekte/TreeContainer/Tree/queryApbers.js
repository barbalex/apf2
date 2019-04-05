import gql from 'graphql-tag'

export default gql`
  query ApbersQuery($filter: ApberFilter!, $isAp: Boolean!) {
    allApbers(filter: $filter, orderBy: LABEL_ASC)
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
