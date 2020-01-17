import gql from 'graphql-tag'

import { ekfrequenz } from '../../../../shared/fragments'

export default gql`
  query ekfrequenzByIdForDelete($id: UUID!) {
    ekfrequenzById(id: $id) {
      ...EkfrequenzFields
    }
  }
  ${ekfrequenz}
`
