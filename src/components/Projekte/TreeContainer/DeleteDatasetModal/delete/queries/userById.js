import { gql } from '@apollo/client'

import { user } from '../../../../../shared/fragments'

export default gql`
  query userByIdForDelete($id: UUID!) {
    userById(id: $id) {
      ...UserFields
    }
  }
  ${user}
`
