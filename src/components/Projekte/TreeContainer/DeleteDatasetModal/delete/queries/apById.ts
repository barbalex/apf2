import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { ap } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query apByIdForDelete($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
