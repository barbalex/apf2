import { gql } from '@apollo/client'

export const query = gql`
  query ekfUser($userId: UUID!) {
    userById(id: $userId) {
      id
      name
    }
  }
`
