import gql from 'graphql-tag'

export default gql`
  query TpopmassnAeEigenschaftensQuery($filter: AeEigenschaftenFilter!) {
    allAeEigenschaftens(first: 10, filter: $filter, orderBy: ARTNAME_ASC) {
      nodes {
        value: artname
        label: artname
      }
    }
  }
`
