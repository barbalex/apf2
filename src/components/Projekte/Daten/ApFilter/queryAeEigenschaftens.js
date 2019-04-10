import gql from 'graphql-tag'

export default gql`
  query ApAeEigenschaftensQuery($filter: AeEigenschaftenFilter!) {
    allAeEigenschaftens(first: 8, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: id
        label: artname
      }
    }
  }
`
