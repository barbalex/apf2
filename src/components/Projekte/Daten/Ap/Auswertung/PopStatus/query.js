import { gql } from '@apollo/client'

export default gql`
  query popDataForPopStatus($apId: UUID!, $year: Int!) {
    # function: pop_nach_status_for_jber
    popNachStatusForJber(apid: $apId, year: $year) {
      nodes {
        year
        a3Lpop
        a4Lpop
        a5Lpop
        a7Lpop
        a8Lpop
        a9Lpop
      }
    }
  }
`
