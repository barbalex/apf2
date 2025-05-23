import { gql } from '@apollo/client'

import { user } from '../../../shared/fragments.js'

export const query = gql`
  query userById($id: UUID!) {
    userById(id: $id) {
      ...UserFields
    }
    allAdresses(
      orderBy: NAME_ASC
      filter: {
        or: [
          { usersByAdresseIdExist: false }
          { usersByAdresseId: { every: { id: { equalTo: $id } } } }
        ]
      }
    ) {
      nodes {
        value: id
        label: name
      }
    }
  }
  ${user}
`
