import { gql } from '@apollo/client'

export default gql`
  query apAuswertungPopMenge($id: UUID!, $jahr: Int!) {
    # view: v_ap_ausw_pop_menge
    allVApAuswPopMenges(
      filter: { apId: { equalTo: $id }, jahr: { lessThanOrEqualTo: $jahr } }
      orderBy: JAHR_ASC
    ) {
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
    # do not need to filter further - is done in allVApAuswPopMenges
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
