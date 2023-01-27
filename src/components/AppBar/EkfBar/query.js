import { gql } from '@apollo/client'

export default gql`
  query ekfUser($userId: UUID!) { 
    userById(id: $userId) {
      id
      name
    }
  }
`
