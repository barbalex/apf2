import { gql } from '@apollo/client'

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
