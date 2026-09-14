import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopmassn } from '../../components/shared/fragments.ts'

export const updateTpopmassnById = dynamicGql`
  mutation updateTpopmassnById($id: UUID!, $tpopId: UUID) {
    updateTpopmassnById(
      input: { id: $id, tpopmassnPatch: { tpopId: $tpopId } }
    ) {
      tpopmassn {
        ...TpopmassnFields
      }
    }
  }
  ${tpopmassn}
` as unknown as TypedDocumentNode<
  { updateTpopmassnById?: { tpopmassn?: { id: string } | null } | null },
  Record<string, unknown>
>
