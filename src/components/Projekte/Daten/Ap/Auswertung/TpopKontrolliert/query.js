import { gql } from '@apollo/client'

// query: v_ap_ausw_tpop_kontrolliert
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
