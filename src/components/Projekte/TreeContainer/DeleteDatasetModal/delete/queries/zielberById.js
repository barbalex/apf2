import { gql } from '@apollo/client'

import { zielber } from '../../../../../shared/fragments.js'

export default gql`
  query zielberByIdForDelete($id: UUID!) {
    zielberById(id: $id) {
      ...ZielberFields
    }
  }
  ${zielber}
`
