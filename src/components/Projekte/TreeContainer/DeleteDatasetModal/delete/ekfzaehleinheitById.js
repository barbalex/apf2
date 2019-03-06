import gql from 'graphql-tag'

import { ekfzaehleinheit } from '../../../../shared/fragments'

export default gql`
  query ekfzaehleinheitById($id: UUID!) {
    ekfzaehleinheitById(id: $id) {
      ...EkfzaehleinheitFields
    }
  }
  ${ekfzaehleinheit}
`
