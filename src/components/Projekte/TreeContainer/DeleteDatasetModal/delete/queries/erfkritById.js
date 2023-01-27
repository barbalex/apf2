import { gql } from '@apollo/client'

import { erfkrit } from '../../../../../shared/fragments'

export default gql`
  query erfkritByIdForDelete($id: UUID!) {
    erfkritById(id: $id) {
      ...ErfkritFields
    }
  }
  ${erfkrit}
`
