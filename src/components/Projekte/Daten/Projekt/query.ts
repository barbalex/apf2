import { gql } from '@apollo/client'

import { projekt } from '../../../shared/fragments.ts'

export const query = gql`
  query projektByIdQuery($id: UUID!) {
    projektById(id: $id) {
      ...ProjektFields
    }
  }
  ${projekt}
`
