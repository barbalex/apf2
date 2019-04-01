import gql from 'graphql-tag'

export default gql`
  query TpopkontrzaehlListsQuery {
    allTpopkontrzaehlEinheitWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
    allTpopkontrzaehlMethodeWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
`
