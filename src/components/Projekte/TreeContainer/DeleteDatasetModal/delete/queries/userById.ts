import { gql } from '@apollo/client'

import { user } from '../../../../../shared/fragments.js'

export default gql`
  query userByIdForDelete($id: UUID!) {
    userById(id: $id) {
      ...UserFields
    }
  }
  ${user}
`
