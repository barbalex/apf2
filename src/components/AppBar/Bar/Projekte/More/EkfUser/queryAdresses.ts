import { graphql } from '../../../../../../gql'

export const queryAdresses = graphql(`
  query adrQuery {
    allUsers(
      orderBy: NAME_ASC
      filter: { role: { equalTo: "apflora_freiwillig" } }
    ) {
      nodes {
        value: id
        label: name
      }
    }
  }
`)
