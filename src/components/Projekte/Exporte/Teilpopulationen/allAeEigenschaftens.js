import gql from 'graphql-tag'

export default gql`
  query Query {
    allAeEigenschaftens {
      nodes {
        id
        artname
        apByArtId {
          id
        }
      }
    }
  }
`
