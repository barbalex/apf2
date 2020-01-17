import gql from 'graphql-tag'

import { ekzaehleinheit } from '../../../../shared/fragments'

export default gql`
  query ekzaehleinheitByIdForDelete($id: UUID!) {
    ekzaehleinheitById(id: $id) {
      ...EkzaehleinheitFields
    }
  }
  ${ekzaehleinheit}
`
