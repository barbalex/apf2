import { gql } from '@apollo/client'

import { pop } from '../../components/shared/fragments'

export default gql`
  mutation updatePopByIdForMoveTo($id: UUID!, $apId: UUID) {
    updatePopById(input: { id: $id, popPatch: { apId: $apId } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
