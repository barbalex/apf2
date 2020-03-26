import gql from 'graphql-tag'

export default gql`
  query apAuswertungPopStatus($id: UUID!) {
    allVApAuswPopStatuses(
      filter: { apId: { equalTo: $id } }
      orderBy: JAHR_ASC
    ) {
      nodes {
        jahr
        values
      }
    }
  }
`
