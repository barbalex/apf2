import gql from 'graphql-tag'

import { tpopber } from '../../../shared/fragments'

export default gql`
  query tpopberByIdQuery($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
      tpopByTpopId {
        id
        popByPopId {
          id
          apId
        }
      }
    }
    allTpopEntwicklungWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
  ${tpopber}
`
