import gql from 'graphql-tag'

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
  }
  ${tpopmassnber}
`
