import gql from 'graphql-tag'

export default gql`
  query ProjektsQuery {
    projekts: allProjekts(orderBy: NAME_ASC) {
      nodes {
        id
        name
      }
    }
  }
`
