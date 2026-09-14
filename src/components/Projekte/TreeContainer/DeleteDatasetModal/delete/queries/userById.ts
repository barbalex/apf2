import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { user } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query userByIdForDelete($id: UUID!) {
    userById(id: $id) {
      ...UserFields
    }
  }
  ${user}
`
