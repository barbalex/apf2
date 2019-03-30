import gql from 'graphql-tag'

import { apber } from '../../../shared/fragments'

export default gql`
  query apberByIdQuery($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
    }
  }
  ${apber}
`
