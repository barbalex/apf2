import { gql } from '@apollo/client'

export default gql`
  mutation createUsermessage($id: UUID!, $userName: String!) {
    createUsermessage(
      input: { usermessage: { userName: $userName, messageId: $id } }
    ) {
      usermessage {
        id
      }
    }
  }
`
