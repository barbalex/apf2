import { gql } from '@apollo/client'

// query: v_ap_ausw_tpop_kontrolliert
export default gql`
  query apAuswertungTpopKontrolliert($id: UUID!) {
    allVApAuswTpopKontrollierts(
      filter: { apId: { equalTo: $id } }
      orderBy: [AP_ID_ASC, JAHR_ASC]
    ) {
      nodes {
        jahr
        anzahlTpop
        anzahlKontrolliert
      }
    }
  }
`
