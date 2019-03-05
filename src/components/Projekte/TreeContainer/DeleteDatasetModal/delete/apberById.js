import gql from 'graphql-tag'

import { apber } from '../../../../shared/fragments'

export default gql`
  query apberById($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
    }
  }
  ${apber}
`
