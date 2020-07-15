import { gql } from '@apollo/client'

export default gql`
  query EkfrequenzQueryForSetStartjahr($id: UUID!) {
    ekfrequenzById(id: $id) {
      id
      kontrolljahreAb
    }
  }
`
