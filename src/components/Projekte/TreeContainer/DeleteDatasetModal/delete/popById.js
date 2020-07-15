import { gql } from '@apollo/client'

import { pop } from '../../../../shared/fragments'

export default gql`
  query popByIdForDelete($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
