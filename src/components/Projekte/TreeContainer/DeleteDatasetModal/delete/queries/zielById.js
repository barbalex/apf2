import { gql } from '@apollo/client'

import { ziel } from '../../../../../shared/fragments'

export default gql`
  query zielByIdForDelete($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
  }
  ${ziel}
`
