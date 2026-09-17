import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { PopFieldsFragment } from '../../gql/graphql.ts'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { pop } from '../../components/shared/fragments.ts'

export const queryPopById = dynamicGql`
  query copyPopToQuery($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
` as unknown as TypedDocumentNode<
  { popById?: PopFieldsFragment | null },
  { id: string }
>
