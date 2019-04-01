import gql from 'graphql-tag'

export default gql`
  query TpopmassnAdressesQuery {
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
