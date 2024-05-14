import { gql } from '@apollo/client'

import { tpopkontr } from '../../../../../shared/fragments.js'

export default gql`
  query tpopkontrByIdForDelete($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
