import { gql } from '@apollo/client'

import { ap } from '../../../shared/fragments.ts'

export const apById = gql`
  query apByIdQueryForApFilter($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
