import { gql } from '@apollo/client'

export const createUsermessage = gql`
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
