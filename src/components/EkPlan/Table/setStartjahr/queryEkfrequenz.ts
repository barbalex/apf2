import { gql } from '@apollo/client'

export const queryEkfrequenz = gql`
  query EkfrequenzQueryForSetStartjahr($id: UUID!) {
    ekfrequenzById(id: $id) {
      id
      kontrolljahreAb
      kontrolljahre
    }
  }
`
