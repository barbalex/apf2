import { gql as dynamicGql } from '../../apolloGql.ts'

import { pop } from '../../components/shared/fragments.ts'

export const updatePopById = dynamicGql`
  mutation updatePopByIdForMoveTo($id: UUID!, $apId: UUID) {
    updatePopById(input: { id: $id, popPatch: { apId: $apId } }) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
`
