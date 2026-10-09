import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { pop } from '../../components/shared/fragments.ts'

export const createPop = dynamicGql`
  mutation createPopForCopyTo(
    $apId: UUID
    $nr: Int
    $name: String
    $status: Int
    $statusUnklar: Boolean
    $statusUnklarBegruendung: String
    $bekanntSeit: Int
    $geomPoint: GeoJSON
  ) {
    createPop(
      input: {
        pop: {
          apId: $apId
          nr: $nr
          name: $name
          status: $status
          statusUnklar: $statusUnklar
          statusUnklarBegruendung: $statusUnklarBegruendung
          bekanntSeit: $bekanntSeit
          geomPoint: $geomPoint
        }
      }
    ) {
      pop {
        ...PopFields
      }
    }
  }
  ${pop}
` as unknown as TypedDocumentNode<
  { createPop?: { pop?: { id: string } | null } | null },
  Record<string, unknown>
>
