import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
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
` as unknown as TypedDocumentNode<
  { updatePopById?: { pop?: { id: string } | null } | null },
  Record<string, unknown>
>
