import { gql } from '@apollo/client'

import { tpopmassn } from '../../../shared/fragments'

export default gql`
  query tpopmassnByIdQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
      tpopByTpopId {
        id
        popByPopId {
          id
          apByApId {
            id
            ekzaehleinheitsByApId(filter: { zielrelevant: { equalTo: true } }) {
              nodes {
                id
                zielrelevant
                notMassnCountUnit
              }
            }
          }
        }
      }
    }
  }
  ${tpopmassn}
`
