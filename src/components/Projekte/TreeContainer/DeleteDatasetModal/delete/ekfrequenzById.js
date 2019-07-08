import gql from 'graphql-tag'

import { ekfrequenz } from '../../../../shared/fragments'

export default gql`
  query ekfrequenzById($id: UUID!) {
    ekfrequenzById(id: $id) {
      ...EkfrequenzFields
    }
  }
  ${ekfrequenz}
`
