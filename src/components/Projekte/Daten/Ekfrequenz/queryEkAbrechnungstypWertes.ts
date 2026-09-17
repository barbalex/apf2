import { graphql } from '../../../../gql/index.ts'

export const queryEkAbrechnungstypWertes = graphql(`
  query EkAbrechnungstypWertesQueryForEkfrequenz {
    allEkAbrechnungstypWertes(
      orderBy: SORT_ASC
      filter: { code: { isNull: false } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
  }
`)
