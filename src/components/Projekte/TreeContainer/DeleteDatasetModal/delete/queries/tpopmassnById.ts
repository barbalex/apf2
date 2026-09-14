import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopmassn } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query tpopmassnByIdForDelete($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
