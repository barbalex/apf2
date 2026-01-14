import { gql } from '@apollo/client'

import { apart } from '../../../../../shared/fragments.js'

export default gql`
  query apartByIdForDelete($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
    }
  }
  ${apart}
`
