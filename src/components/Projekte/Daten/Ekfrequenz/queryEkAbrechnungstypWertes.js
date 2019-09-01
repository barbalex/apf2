import gql from 'graphql-tag'

export default gql`
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
