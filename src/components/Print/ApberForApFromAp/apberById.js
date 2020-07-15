import { gql } from '@apollo/client'

import { apber } from '../../shared/fragments'

export default gql`
  query apberById($apberId: UUID!) {
    apberById(id: $apberId) {
      ...ApberFields
    }
  }
  ${apber}
`
