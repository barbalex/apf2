import gql from 'graphql-tag'

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
    allAeLrdelarzes(orderBy: SORT_ASC) {
      nodes {
        id
        label
        einheit
      }
    }
  }
`
