import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { ekfrequenz } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query ekfrequenzByIdForDelete($id: UUID!) {
    ekfrequenzById(id: $id) {
      ...EkfrequenzFields
    }
  }
  ${ekfrequenz}
`
