import gql from 'graphql-tag'

export default gql`
  query AllTpopmassnErfbeurtWertesQuery {
    allTpopmassnErfbeurtWertes {
      nodes {
        id
        code
        text
        sort
      }
    }
  }
`
