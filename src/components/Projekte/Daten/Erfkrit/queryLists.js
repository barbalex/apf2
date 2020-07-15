import { gql } from '@apollo/client'

export default gql`
  query ErfkritListsQuery {
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
