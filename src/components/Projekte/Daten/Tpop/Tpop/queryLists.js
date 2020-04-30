import gql from 'graphql-tag'

export default gql`
  query TpopListsQueryForTpop {
    allTpopApberrelevantGrundWertes(
      orderBy: SORT_ASC
      filter: { code: { isNull: false } }
    ) {
      nodes {
        value: code
        label: text
      }
    }
    allChGemeindes(orderBy: NAME_ASC) {
      nodes {
        value: name
        label: name
      }
    }
  }
`
