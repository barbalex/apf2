import gql from 'graphql-tag'

export default gql`
  query TpopberListsQuery {
    allTpopEntwicklungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
