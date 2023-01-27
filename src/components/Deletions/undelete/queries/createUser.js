import { gql } from '@apollo/client'

import { user } from '../../../shared/fragments'

export default gql`
  mutation createUserForUndelete(
    $id: UUID
    $name: String
    $email: String
    $role: String
    $pass: String
  ) {
    createUser(
      input: {
        user: { id: $id, name: $name, email: $email, role: $role, pass: $pass }
      }
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${user}
`
