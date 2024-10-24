import { gql } from '@apollo/client'

import { ekfrequenz } from '../../../shared/fragments.js'

export default gql`
  query ekfrequenzByIdQuery($id: UUID!) {
    ekfrequenzById(id: $id) {
      ...EkfrequenzFields
      apByApId {
        id
        ekfrequenzsByApId {
          nodes {
            ...EkfrequenzFields
          }
        }
      }
    }
  }
  ${ekfrequenz}
`
