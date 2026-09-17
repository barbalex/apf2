import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { apber } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query apberByIdForDelete($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
    }
  }
  ${apber}
`
