import { gql } from '@apollo/client'

import { erfkrit } from '../../../shared/fragments.js'

export const query = gql`
  query erfkritByIdQuery($id: UUID!) {
    erfkritById(id: $id) {
      ...ErfkritFields
    }
  }
  ${erfkrit}
`
