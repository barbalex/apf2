import { gql } from '@apollo/client'

import { popber } from '../../../../../shared/fragments.js'

export default gql`
  query popberByIdForDelete($id: UUID!) {
    popberById(id: $id) {
      ...PopberFields
    }
  }
  ${popber}
`
