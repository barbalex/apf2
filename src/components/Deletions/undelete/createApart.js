import gql from 'graphql-tag'

import { apart } from '../../shared/fragments'

export default gql`
  mutation createApartForUndelete($id: UUID, $apId: UUID, $artId: UUID) {
    createApart(input: { apart: { id: $id, apId: $apId, artId: $artId } }) {
      apart {
        ...ApartFields
      }
    }
  }
  ${apart}
`
