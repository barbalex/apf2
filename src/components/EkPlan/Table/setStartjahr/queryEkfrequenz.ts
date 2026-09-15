import { graphql } from '../../../../gql/index.ts'

export const queryEkfrequenz = graphql(`
  query EkfrequenzQueryForSetStartjahr($id: UUID!) {
    ekfrequenzById(id: $id) {
      id
      kontrolljahreAb
      kontrolljahre
    }
  }
`)
