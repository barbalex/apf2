import { gql } from '@apollo/client'

export default gql`
  query zielTypWertesQueryForZiel {
    allZielTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
