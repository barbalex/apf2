import { gql } from '@apollo/client'

import { ap } from '../../../../../shared/fragments.ts'

export default gql`
  query apByIdForDelete($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
