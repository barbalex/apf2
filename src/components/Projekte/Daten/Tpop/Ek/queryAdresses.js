import gql from 'graphql-tag'

export default gql`
  query TpopfeldkontrAdressesQueryForEk {
    allAdresses(orderBy: NAME_ASC, filter: { usersByAdresseIdExist: true }) {
      nodes {
        value: id
        label: name
      }
    }
  }
`
