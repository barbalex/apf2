import { gql } from '@apollo/client'

export const queryLists = gql`
  query ErfkritListsQuery {
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
