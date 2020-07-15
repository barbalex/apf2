import { gql } from '@apollo/client'

import { user } from '../../../shared/fragments'

export default gql`
  mutation updateUserForUser(
    $id: UUID!
    $name: String
    $email: String
    $role: String
    $pass: String
    $adresseId: UUID
  ) {
    updateUserById(
      input: {
        id: $id
        userPatch: {
          id: $id
          name: $name
          email: $email
          role: $role
          pass: $pass
          adresseId: $adresseId
        }
      }
    ) {
      user {
        ...UserFields
      }
    }
  }
  ${user}
`
