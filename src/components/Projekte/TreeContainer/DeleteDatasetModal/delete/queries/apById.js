import { gql } from '@apollo/client'

import { ap } from '../../../../../shared/fragments'

export default gql`
  query apByIdForDelete($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
