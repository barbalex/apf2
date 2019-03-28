import gql from 'graphql-tag'

export default gql`
  query AeEigenschaftensQuery {
    allAeEigenschaftens {
      nodes {
        id
        artname
      }
    }
  }
`
