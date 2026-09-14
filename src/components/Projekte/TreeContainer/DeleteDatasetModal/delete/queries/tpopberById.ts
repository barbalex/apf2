import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopber } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query tpopberByIdForDelete($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
  }
  ${tpopber}
`
