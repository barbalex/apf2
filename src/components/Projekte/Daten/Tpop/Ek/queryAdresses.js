import gql from 'graphql-tag'

export default gql`
  query TpopfeldkontrAdressesQuery {
    allAdresses(orderBy: NAME_ASC, filter: { usersByAdresseIdExist: true }) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
