import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import type { BeobFieldsFragment } from '../../gql/graphql.ts'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { beob } from '../../components/shared/fragments.ts'

export const queryBeob = dynamicGql`
  query copyBeobZugeordnetKoordToTpopQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
` as unknown as TypedDocumentNode<
  { beobById?: BeobFieldsFragment | null },
  { id: string }
>
