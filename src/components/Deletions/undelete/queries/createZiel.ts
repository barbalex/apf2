import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ziel } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createZielForUndelete(
    $id: UUID
    $apId: UUID
    $typ: Int
    $jahr: Int
    $bezeichnung: String
    $erreichung: String
    $bemerkungen: String
  ) {
    createZiel(
      input: {
        ziel: {
          id: $id
          apId: $apId
          typ: $typ
          jahr: $jahr
          bezeichnung: $bezeichnung
          erreichung: $erreichung
          bemerkungen: $bemerkungen
        }
      }
    ) {
      ziel {
        ...ZielFields
      }
    }
  }
  ${ziel}
`
