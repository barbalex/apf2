import gql from 'graphql-tag'

import { tpopmassnber } from '../../../../shared/fragments'

export default gql`
  query tpopmassnberByIdForDelete($id: UUID!) {
    tpopmassnberById(id: $id) {
      ...TpopmassnberFields
    }
  }
  ${tpopmassnber}
`
