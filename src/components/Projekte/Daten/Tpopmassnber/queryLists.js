import { gql } from '@apollo/client'

export default gql`
  query AllTpopmassnErfbeurtWertesQuery {
    allTpopmassnErfbeurtWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
