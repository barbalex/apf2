import { gql } from '@apollo/client'

import { tpopber } from '../../../../shared/fragments'

export default gql`
  query tpopberByIdForDelete($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
  }
  ${tpopber}
`
