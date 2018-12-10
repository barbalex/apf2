import gql from 'graphql-tag'

export default gql`
  query ProjektsQuery {
    allProjekts(orderBy: NAME_ASC) {
      nodes {
        id
        name
      }
    }
  }
`
