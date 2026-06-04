import { gql } from '@apollo/client'

import { ekfrequenz } from '../../../../../shared/fragments.ts'

export default gql`
  query ekfrequenzByIdForDelete($id: UUID!) {
    ekfrequenzById(id: $id) {
      ...EkfrequenzFields
    }
  }
  ${ekfrequenz}
`
