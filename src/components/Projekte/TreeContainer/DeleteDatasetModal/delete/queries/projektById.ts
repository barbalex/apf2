import { gql } from '@apollo/client'

import { projekt } from '../../../../../shared/fragments.ts'

export default gql`
  query projektByIdForDelete($id: UUID!) {
    projektById(id: $id) {
      ...ProjektFields
    }
  }
  ${projekt}
`
