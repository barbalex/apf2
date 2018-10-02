import gql from 'graphql-tag'

export default gql`
  query AllTpopkontrzaehlEinheitWertesQuery {
    allTpopkontrzaehlEinheitWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
`
