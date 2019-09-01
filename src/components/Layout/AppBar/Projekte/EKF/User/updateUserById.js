import gql from 'graphql-tag'

import { user } from '../../../../../shared/fragments'

export default gql`
  mutation updateUserForEkfUser(
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
