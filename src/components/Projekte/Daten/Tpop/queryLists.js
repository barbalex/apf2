import gql from 'graphql-tag'

export default gql`
  query TpopListsQuery {
    allTpopApberrelevantGrundWertes(orderBy: CODE_ASC) {
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
