import gql from 'graphql-tag'

export default gql`
  query TpopmassnAeEigenschaftensQuery {
    allAeEigenschaftens(orderBy: ARTNAME_ASC) {
      nodes {
        value: artname
        label: artname
      }
    }
  }
`
