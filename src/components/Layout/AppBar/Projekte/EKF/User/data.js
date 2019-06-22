import gql from 'graphql-tag'

export default gql`
  query userByName($name: String!) {
    userByName(name: $name) {
      id
      name
      email
      role
      pass
      adresseId
    }
  }
`
