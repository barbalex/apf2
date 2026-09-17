import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { user } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
