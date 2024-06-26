import { gql } from '@apollo/client'

import { ekzaehleinheit } from '../../../../../shared/fragments.js'

export default gql`
  query ekzaehleinheitByIdForDelete($id: UUID!) {
    ekzaehleinheitById(id: $id) {
      ...EkzaehleinheitFields
    }
  }
  ${ekzaehleinheit}
`
