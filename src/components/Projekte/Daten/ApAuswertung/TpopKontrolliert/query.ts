import { gql } from '@apollo/client'

export const query = gql`
  query apAuswertungTpopKontrolliert($id: UUID!, $year: Int!) {
    # function: tpop_kontrolliert_for_jber
    tpopKontrolliertForJber(
      apid: $id
      filter: { year: { lessThanOrEqualTo: $year } }
    ) {
      nodes {
        year
        anzTpop
        anzTpopber
      }
    }
  }
`
