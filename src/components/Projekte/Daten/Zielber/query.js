import gql from 'graphql-tag'

import { zielber } from '../../../shared/fragments'

export default gql`
  query zielberByIdQuery($id: UUID!) {
    zielberById(id: $id) {
      ...ZielberFields
      zielByZielId {
        id
        apId
      }
    }
  }
  ${zielber}
`
