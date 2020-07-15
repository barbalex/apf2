import { gql } from '@apollo/client'

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
