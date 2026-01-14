import { gql } from '@apollo/client'

import { projekt } from '../../../../../shared/fragments.js'

export default gql`
  query projektByIdForDelete($id: UUID!) {
    projektById(id: $id) {
      ...ProjektFields
    }
  }
  ${projekt}
`
