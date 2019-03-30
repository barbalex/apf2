import gql from 'graphql-tag'

export default gql`
  query AllApsQuery($apFilter: ApFilter!) {
    allAps {
      totalCount
    }
    filteredAps: allAps(filter: $apFilter) {
      totalCount
    }
  }
`
