import { gql } from '@apollo/client'

import { ekzaehleinheit } from '../../../../../shared/fragments'

export default gql`
  query ekzaehleinheitByIdForDelete($id: UUID!) {
    ekzaehleinheitById(id: $id) {
      ...EkzaehleinheitFields
    }
  }
  ${ekzaehleinheit}
`
