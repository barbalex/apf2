import { gql } from '@apollo/client'

import { popber } from '../../../../../shared/fragments'

export default gql`
  query popberByIdForDelete($id: UUID!) {
    popberById(id: $id) {
      ...PopberFields
    }
  }
  ${popber}
`
