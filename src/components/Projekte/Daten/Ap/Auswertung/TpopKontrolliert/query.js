import gql from 'graphql-tag'

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
