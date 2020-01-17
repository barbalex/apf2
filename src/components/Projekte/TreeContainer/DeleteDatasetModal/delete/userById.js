import gql from 'graphql-tag'

import { user } from '../../../../shared/fragments'

export default gql`
  query userByIdForDelete($id: UUID!) {
    userById(id: $id) {
      ...UserFields
    }
  }
  ${user}
`
