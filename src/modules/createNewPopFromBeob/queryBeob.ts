import type { TypedDocumentNode } from '@graphql-typed-document-node/core'

import { gql as dynamicGql } from '../../apolloGql.ts'
import type { BeobFieldsFragment } from '../../gql/graphql.ts'

import { beob } from '../../components/shared/fragments.ts'

// built with interpolation, so graphql-codegen can't type it — typed by hand
export const queryBeob = dynamicGql`
  query createNewPopFromBeobQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
` as unknown as TypedDocumentNode<
  { beobById?: BeobFieldsFragment | null },
  { id: string }
>
