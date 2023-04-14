import { gql } from '@apollo/client'

export default gql`
  query apAuswertungPopMenge($id: UUID!, $jahr: Int!) {
    # function: apflora.ap_ausw_pop_menge
    apAuswPopMenge(apid: $id, jahr: $jahr) {
      nodes {
        jahr
        values
      }
    }
    allEkzaehleinheits(
      filter: { apId: { equalTo: $id }, zielrelevant: { equalTo: true } }
    ) {
      nodes {
        id
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          id
          text
        }
      }
    }
    # do not need to filter further - is done in apAuswPopMenge
    allPops(filter: { apId: { equalTo: $id } }, orderBy: [NR_ASC, NAME_ASC]) {
      nodes {
        id
        nr
        name
        status
      }
    }
  }
`
