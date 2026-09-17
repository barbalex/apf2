import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { TpopkontrzaehlFieldsFragment } from '../../gql/graphql.ts'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopkontrzaehl } from '../../components/shared/fragments.ts'

export const queryTpopkontrzaehlById = dynamicGql`
  query copyEkZaehlToQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
` as unknown as TypedDocumentNode<
  { tpopkontrzaehlById?: TpopkontrzaehlFieldsFragment | null },
  { id: string }
>
