import { gql } from '@apollo/client'

import { zielber } from '../../../../../shared/fragments'

export default gql`
  query zielberByIdForDelete($id: UUID!) {
    zielberById(id: $id) {
      ...ZielberFields
    }
  }
  ${zielber}
`
