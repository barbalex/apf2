import gql from 'graphql-tag'

import { ber } from '../../../shared/fragments'

export default gql`
  mutation updateBer(
    $id: UUID!
    $apId: UUID
    $autor: String
    $jahr: Int
    $titel: String
    $url: String
    $changedBy: String
  ) {
    updateBerById(
      input: {
        id: $id
        berPatch: {
          id: $id
          apId: $apId
          autor: $autor
          jahr: $jahr
          titel: $titel
          url: $url
          changedBy: $changedBy
        }
      }
    ) {
      ber {
        ...BerFields
      }
    }
  }
  ${ber}
`
