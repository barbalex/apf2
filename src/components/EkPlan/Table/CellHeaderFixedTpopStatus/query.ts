import { gql } from '@apollo/client'

export const query = gql`
  query popStatusWerteForEkplanHeaderFixed {
    allPopStatusWertes(orderBy: CODE_ASC) {
      nodes {
        id
        code
        text
      }
    }
  }
`
