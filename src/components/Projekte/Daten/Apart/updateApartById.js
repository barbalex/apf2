import gql from 'graphql-tag'

import { apart } from '../../../shared/fragments'

export default gql`
  mutation updateApart(
    $id: UUID!
    $apId: UUID
    $artId: UUID
    $changedBy: String
  ) {
    updateApartById(
      input: {
        id: $id
        apartPatch: {
          id: $id
          apId: $apId
          artId: $artId
          changedBy: $changedBy
        }
      }
    ) {
      apart {
        ...ApartFields
      }
    }
  }
  ${apart}
`
