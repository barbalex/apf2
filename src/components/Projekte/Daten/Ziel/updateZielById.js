import { gql } from '@apollo/client'

import { ziel } from '../../../shared/fragments'

export default gql`
  mutation updateZiel(
    $id: UUID!
    $apId: UUID
    $typ: Int
    $jahr: Int
    $bezeichnung: String
    $changedBy: String
  ) {
    updateZielById(
      input: {
        id: $id
        zielPatch: {
          id: $id
          apId: $apId
          typ: $typ
          jahr: $jahr
          bezeichnung: $bezeichnung
          changedBy: $changedBy
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
