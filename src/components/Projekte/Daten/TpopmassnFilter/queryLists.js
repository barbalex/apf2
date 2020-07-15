import { gql } from '@apollo/client'

export default gql`
  query TpopmassnFilterListsQuery {
    allTpopmassnTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
        historic
      }
    }
    allTpopkontrzaehlEinheitWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
        historic
      }
    }
  }
`
