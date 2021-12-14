import { gql } from '@apollo/client'

import { tpopmassnber } from '../../../shared/fragments'

export default gql`
  query tpopmassnberByIdQuery($id: UUID!) {
    tpopmassnberById(id: $id) {
      ...TpopmassnberFields
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
    allTpopmassnErfbeurtWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${tpopmassnber}
`
