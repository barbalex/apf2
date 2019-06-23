import gql from 'graphql-tag'

import { ekzaehleinheit } from '../../../../shared/fragments'

export default gql`
  query ekzaehleinheitById($id: UUID!) {
    ekzaehleinheitById(id: $id) {
      ...EkzaehleinheitFields
    }
  }
  ${ekzaehleinheit}
`
