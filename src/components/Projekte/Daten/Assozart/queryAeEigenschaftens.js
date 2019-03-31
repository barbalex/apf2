import gql from 'graphql-tag'

export default gql`
  query AssozartAeEigenschaftensQuery($filter: AeEigenschaftenFilter!) {
    allAeEigenschaftens(filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`
