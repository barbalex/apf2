import gql from 'graphql-tag'

import { tpopmassnber } from '../../../../shared/fragments'

export default gql`
  query tpopmassnberById($id: UUID!) {
    tpopmassnberById(id: $id) {
      ...TpopmassnberFields
    }
  }
  ${tpopmassnber}
`
