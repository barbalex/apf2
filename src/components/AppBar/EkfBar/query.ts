import { graphql } from '../../../gql/index.ts'

export const query = graphql(`
  query ekfUser($userId: UUID!) {
    userById(id: $userId) {
      id
      name
    }
  }
`)
