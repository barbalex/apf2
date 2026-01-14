import { gql } from '@apollo/client'

import { tpopkontr } from '../../../../../shared/fragments.ts'

export default gql`
  query tpopkontrByIdForDelete($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
