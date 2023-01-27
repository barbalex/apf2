import { gql } from '@apollo/client'

export default gql`
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
