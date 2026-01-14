import { gql } from '@apollo/client'

import { tpop } from '../../../../../shared/fragments.ts'

export default gql`
  query tpopByIdForDelete($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
