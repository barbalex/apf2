import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { TpopFieldsFragment } from '../../gql/graphql.ts'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpop } from '../../components/shared/fragments.ts'

export const queryTpopById = dynamicGql`
  query copyTpopToQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
` as unknown as TypedDocumentNode<
  { tpopById?: TpopFieldsFragment | null },
  { id: string }
>
