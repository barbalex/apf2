import gql from 'graphql-tag'

import { apber } from '../../shared/fragments'

export default gql`
  query apberById($apberId: UUID!) {
    apberById(id: $apberId) {
      ...ApberFields
    }
  }
  ${apber}
`
