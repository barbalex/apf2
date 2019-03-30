import gql from 'graphql-tag'

export default gql`
  query ApAeEigenschaftensQuery {
    allAeEigenschaftens(
      filter: { apByArtIdExists: true }
      orderBy: ARTNAME_ASC
    ) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`
