import { gql } from '@apollo/client'

export const query = gql`
  query popAuswertungTpopMenge($apId: UUID!, $id: UUID!) {
    popById(id: $id) {
      id
      label
    }
    # function apflora.pop_ausw_tpop_menge
    popAuswTpopMenge(popid: $id) {
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
    # do not need to filter further - is done in popAuswTpopMenge
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
