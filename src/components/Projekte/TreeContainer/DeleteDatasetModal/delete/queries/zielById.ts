import { gql } from '@apollo/client'

import { ziel } from '../../../../../shared/fragments.ts'

export default gql`
  query zielByIdForDelete($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
  }
  ${ziel}
`
