import gql from 'graphql-tag'

import { popStatusWerte } from '../../../../shared/fragments'

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
    allPopStatusWertes(orderBy: SORT_ASC) {
      nodes {
        ...PopStatusWerteFields
      }
    }
  }
  ${popStatusWerte}
`
