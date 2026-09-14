import { graphql } from '../../../../gql'

export const query = graphql(`
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
`)
