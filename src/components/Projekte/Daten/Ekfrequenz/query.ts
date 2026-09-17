import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ekfrequenz } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
