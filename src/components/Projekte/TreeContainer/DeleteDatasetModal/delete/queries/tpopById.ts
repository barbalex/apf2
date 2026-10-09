import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpop } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query tpopByIdForDelete($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
