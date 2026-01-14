import { gql } from '@apollo/client'

export const queryEkAbrechnungstypWertes = gql`
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
`
