import { gql } from '@apollo/client'

export default gql`
  query apAuswertungTpopKontrolliert($id: UUID!) {
    # function: tpop_kontrolliert_for_jber
    tpopKontrolliertForJber(apid: $id) {
      nodes {
        year
        anzTpop
        anzTpopber
      }
    }
  }
`
