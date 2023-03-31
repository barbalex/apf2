import { gql } from '@apollo/client'

export default gql`
  query popAuswertungTpopMenge($apId: UUID!, $id: UUID!) {
    # view: v_pop_ausw_tpop_menge
    allVPopAuswTpopMenges(
      filter: { popId: { equalTo: $id } }
      orderBy: JAHR_ASC
    ) {
      nodes {
        jahr
        values
      }
    }
    allEkzaehleinheits(
      filter: { apId: { equalTo: $apId }, zielrelevant: { equalTo: true } }
    ) {
      nodes {
        id
        tpopkontrzaehlEinheitWerteByZaehleinheitId {
          id
          text
        }
      }
    }
    # do not need to filter further - is done in allVPopAuswTpopMenges
    allTpops(
      filter: { popId: { equalTo: $id } }
      orderBy: [NR_ASC, LABEL_ASC]
    ) {
      nodes {
        id
        nr
        label
        status
      }
    }
  }
`
