import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { TpopmassnFieldsFragment } from '../../gql/graphql.ts'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopmassn } from '../../components/shared/fragments.ts'

export const queryTpopmassnById = dynamicGql`
  query copyTpopmassnToQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
` as unknown as TypedDocumentNode<
  { tpopmassnById?: TpopmassnFieldsFragment | null },
  { id: string }
>
