import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { popber } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query popberByIdForDelete($id: UUID!) {
    popberById(id: $id) {
      ...PopberFields
    }
  }
  ${popber}
`
