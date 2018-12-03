import gql from 'graphql-tag'

export default gql`
  mutation updateUser(
    $id: UUID!
    $name: String
    $email: String
    $role: String
    $pass: String
    $adresseId: UUID
    $changedBy: String
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
          changedBy: $changedBy
        }
      }
    ) {
      user {
        id
        name
        email
        role
        pass
        adresseId
        changedBy
      }
    }
  }
`
