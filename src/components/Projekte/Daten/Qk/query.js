import gql from 'graphql-tag'

export default gql`
  query QkApqkQueryForQkTop($apId: UUID!) {
    allQks {
      totalCount
    }
    allApqks(filter: { apId: { equalTo: $apId } }) {
      totalCount
    }
  }
`
