import { gql } from '@apollo/client'

import { tpopmassnber } from '../../../../../shared/fragments.ts'

export default gql`
  query tpopmassnberByIdForDelete($id: UUID!) {
    tpopmassnberById(id: $id) {
      ...TpopmassnberFields
    }
  }
  ${tpopmassnber}
`
