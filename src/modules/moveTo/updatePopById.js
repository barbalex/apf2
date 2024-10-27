import { gql } from '@apollo/client'

import { pop } from '../../components/shared/fragments.js'

export const updatePopById = gql`
  mutation updatePopByIdForMoveTo($id: UUID!, $apId: UUID) {
    updatePopById(input: { id: $id, popPatch: { apId: $apId } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
