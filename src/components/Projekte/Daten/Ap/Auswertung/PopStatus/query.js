import { gql } from '@apollo/client'

export default gql`
  query popDataForPopStatus($apId: UUID!) {
    # function: pop_nach_status_for_jber
    popNachStatusForJber(apid: $apId) {
      nodes {
        year
        a3Lpop
        a4Lpop
        a5Lpop
        a7Lpop
        a8Lpop
        a9Lpop
        a10Lpop
      }
    }
  }
`
