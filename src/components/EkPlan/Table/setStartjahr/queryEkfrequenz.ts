import { graphql } from '../../../../gql'

export const queryEkfrequenz = graphql(`
  query EkfrequenzQueryForSetStartjahr($id: UUID!) {
    ekfrequenzById(id: $id) {
      id
      kontrolljahreAb
      kontrolljahre
    }
  }
`)
