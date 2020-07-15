import { gql } from '@apollo/client'

export default gql`
  query TpopfeldkontrListsQuery {
    allTpopkontrIdbiotuebereinstWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopEntwicklungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allAeLrDelarzes(orderBy: LABEL_ASC) {
      nodes {
        id
        label
        einheit
      }
    }
  }
`
