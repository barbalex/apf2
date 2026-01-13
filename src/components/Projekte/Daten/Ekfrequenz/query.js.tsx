import { gql } from '@apollo/client'

import { ekfrequenz } from '../../../shared/fragments.js'

export const query = gql`
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
