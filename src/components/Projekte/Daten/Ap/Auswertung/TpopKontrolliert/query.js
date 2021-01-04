import { gql } from '@apollo/client'

export default gql`
  query apAuswertungTpopKontrolliert($id: UUID!) {
    tpopKontrolliertForJber(apid: $id) {
      nodes {
        year
        anzTpop
        anzTpopber
      }
    }
  }
`
