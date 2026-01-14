import { gql } from '@apollo/client'

import { pop } from '../../../../../shared/fragments.ts'

export default gql`
  query popByIdForDelete($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
