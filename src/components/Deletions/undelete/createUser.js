import gql from 'graphql-tag'

export default gql`
  mutation createUser(
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
        id
        name
        email
        role
        pass
      }
    }
  }
`
