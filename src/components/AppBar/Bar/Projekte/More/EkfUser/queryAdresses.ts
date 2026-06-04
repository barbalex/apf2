import { gql } from '@apollo/client'

export const queryAdresses = gql`
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
`
