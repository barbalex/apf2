import { gql } from '@apollo/client'

import { apber } from '../../../../../shared/fragments.js'

export default gql`
  query apberByIdForDelete($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
    }
  }
  ${apber}
`
