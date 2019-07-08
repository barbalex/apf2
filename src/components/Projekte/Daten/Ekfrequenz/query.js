import gql from 'graphql-tag'

import { ekfrequenz } from '../../../shared/fragments'

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
