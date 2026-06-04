import { gql } from '@apollo/client'

import { tpopber } from '../../../../../shared/fragments.ts'

export default gql`
  query tpopberByIdForDelete($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
  }
  ${tpopber}
`
