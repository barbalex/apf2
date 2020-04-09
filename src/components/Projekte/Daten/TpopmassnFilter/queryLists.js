import gql from 'graphql-tag'

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
