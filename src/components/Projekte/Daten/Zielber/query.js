import { gql } from '@apollo/client'

import { zielber } from '../../../shared/fragments.js'

export default gql`
  query zielberByIdQuery($id: UUID!) {
    zielberById(id: $id) {
      ...ZielberFields
    }
  }
  ${zielber}
`
