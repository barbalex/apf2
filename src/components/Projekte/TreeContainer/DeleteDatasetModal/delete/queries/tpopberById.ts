import { gql } from '@apollo/client'

import { tpopber } from '../../../../../shared/fragments.js'

export default gql`
  query tpopberByIdForDelete($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
  }
  ${tpopber}
`
