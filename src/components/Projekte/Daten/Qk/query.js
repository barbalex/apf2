import gql from 'graphql-tag'

export default gql`
  query QkApqkQuery($apId: UUID!) {
    allQks {
      totalCount
    }
    allApqks(filter: { apId: { equalTo: $apId } }) {
      totalCount
    }
  }
`
