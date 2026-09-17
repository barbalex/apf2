import { graphql } from '../../gql/index.ts'

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
