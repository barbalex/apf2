import { gql } from '@apollo/client'

import { beob } from '../../../shared/fragments.js'

export default gql`
  query beobByIdQueryForBeob($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
