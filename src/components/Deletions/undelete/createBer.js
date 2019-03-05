import gql from 'graphql-tag'

import { ber } from '../../shared/fragments'

export default gql`
  mutation createBer(
    $id: UUID
    $apId: UUID
    $autor: String
    $jahr: Int
    $titel: String
    $url: String
  ) {
    createBer(
      input: {
        ber: {
          id: $id
          apId: $apId
          autor: $autor
          jahr: $jahr
          titel: $titel
          url: $url
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
