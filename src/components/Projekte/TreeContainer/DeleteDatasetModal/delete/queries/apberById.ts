import { gql } from '@apollo/client'

import { apber } from '../../../../../shared/fragments.ts'

export default gql`
  query apberByIdForDelete($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
    }
  }
  ${apber}
`
