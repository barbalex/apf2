import { gql } from '@apollo/client'

import { tpop } from '../../../../../shared/fragments.js'

export default gql`
  query tpopByIdForDelete($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
