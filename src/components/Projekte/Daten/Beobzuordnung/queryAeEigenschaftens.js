import gql from 'graphql-tag'

export default gql`
  query BeobzuordnungAeEigenschaftensQuery {
    allAeEigenschaftens(orderBy: ARTNAME_ASC) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`
