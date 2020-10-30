import { gql } from '@apollo/client'

export default gql`
  query ekfUser($name: String!) {
    userByName(name: $name) {
      id
      adresseId
    }
  }
`
