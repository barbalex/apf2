import { gql } from '@apollo/client'

export default gql`
  query tpopById($id: UUID!) {
    tpopById(id: $id) {
      id
      lv95X
      lv95Y
    }
  }
`
