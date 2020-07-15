import { gql } from '@apollo/client'

export default gql`
  query AllApErfkritWertesQuery {
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
