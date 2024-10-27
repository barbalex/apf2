import { gql } from '@apollo/client'

export const query = gql`
  query userByNameForEkfBar($name: String!) {
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
