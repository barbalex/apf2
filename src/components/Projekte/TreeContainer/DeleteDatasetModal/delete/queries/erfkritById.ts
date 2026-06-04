import { gql } from '@apollo/client'

import { erfkrit } from '../../../../../shared/fragments.ts'

export default gql`
  query erfkritByIdForDelete($id: UUID!) {
    erfkritById(id: $id) {
      ...ErfkritFields
    }
  }
  ${erfkrit}
`
