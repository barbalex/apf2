import gql from 'graphql-tag'

export default gql`
  query ApAeEigenschaftensQuery {
    allAeEigenschaftens {
      nodes {
        id
        artname
      }
    }
  }
`
