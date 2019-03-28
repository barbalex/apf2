import gql from 'graphql-tag'

export default gql`
  query popByIdQuery($showFilter: Boolean!, $apFilter: ApFilter!) {
    allAps(filter: $apFilter) @include(if: $showFilter) {
      nodes {
        id
      }
    }
  }
`
