/**
 * 2021.01.03: not in use any more
 */
import { gql } from '@apollo/client'

// query: v_ap_ausw_pop_status
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
