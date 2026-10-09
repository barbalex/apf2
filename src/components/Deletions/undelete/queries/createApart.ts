import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { apart } from '../../../shared/fragments.ts'

export default dynamicGql`
  mutation createApartForUndelete($id: UUID, $apId: UUID, $artId: UUID) {
    createApart(input: { apart: { id: $id, apId: $apId, artId: $artId } }) {
      apart {
        ...ApartFields
      }
    }
  }
  ${apart}
`
