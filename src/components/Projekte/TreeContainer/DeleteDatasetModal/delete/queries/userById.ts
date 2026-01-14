import { gql } from '@apollo/client'

import { user } from '../../../../../shared/fragments.ts'

export default gql`
  query userByIdForDelete($id: UUID!) {
    userById(id: $id) {
      ...UserFields
    }
  }
  ${user}
`
