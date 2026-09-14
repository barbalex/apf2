import type { TypedDocumentNode } from '@graphql-typed-document-node/core'
import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpop } from '../../components/shared/fragments.ts'

export const createTpop = dynamicGql`
  mutation createTpopForCreateNewPopFromBeob(
    $popId: UUID
    $gemeinde: String
    $flurname: String
    $geomPoint: GeoJSON
    $bekanntSeit: Int
  ) {
    createTpop(
      input: {
        tpop: {
          popId: $popId
          gemeinde: $gemeinde
          flurname: $flurname
          geomPoint: $geomPoint
          bekanntSeit: $bekanntSeit
        }
      }
    ) {
      tpop {
        ...TpopFields
      }
    }
  }
  ${tpop}
` as unknown as TypedDocumentNode<
  { createTpop?: { tpop?: { id: string; popId: string | null } | null } | null },
  Record<string, unknown>
>
