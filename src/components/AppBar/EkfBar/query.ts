import { graphql } from '../../../gql'

export const query = graphql(`
  query ekfUser($userId: UUID!) {
    userById(id: $userId) {
      id
      name
    }
  }
`)
