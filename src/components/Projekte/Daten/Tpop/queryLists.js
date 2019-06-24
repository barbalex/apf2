import gql from 'graphql-tag'

export default gql`
  query TpopListsQuery {
    allEkAbrechnungstypWertes(
      orderBy: SORT_ASC
      filter: { code: { isNull: false } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopApberrelevantGrundWertes(
      orderBy: SORT_ASC
      filter: { code: { isNull: false } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
    allGemeindes(orderBy: NAME_ASC) {
      nodes {
        value: name
        label: name
      }
    }
  }
`
