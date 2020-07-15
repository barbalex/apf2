import { gql } from '@apollo/client'

import { zielber } from '../../../shared/fragments'

export default gql`
  query zielberByIdQuery($id: UUID!) {
    zielberById(id: $id) {
      ...ZielberFields
    }
  }
  ${zielber}
`
