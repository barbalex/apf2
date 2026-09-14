import { graphql } from '../../gql'

export const createUsermessage = graphql(`
  mutation createUsermessage($id: UUID!, $userName: String!) {
    createUsermessage(
      input: { usermessage: { userName: $userName, messageId: $id } }
    ) {
      usermessage {
        id
      }
    }
  }
`)
