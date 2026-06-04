import { gql } from '@apollo/client'

import { beob } from '../../../../../shared/fragments.ts'

export default gql`
  query beobByIdForDelete($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
