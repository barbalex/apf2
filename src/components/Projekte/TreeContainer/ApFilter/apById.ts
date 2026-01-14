import { gql } from '@apollo/client'

import { ap } from '../../../shared/fragments.js'

export const apById = gql`
  query apByIdQueryForApFilter($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
