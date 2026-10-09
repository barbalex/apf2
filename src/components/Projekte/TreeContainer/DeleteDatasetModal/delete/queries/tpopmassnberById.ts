import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { tpopmassnber } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query tpopmassnberByIdForDelete($id: UUID!) {
    tpopmassnberById(id: $id) {
      ...TpopmassnberFields
    }
  }
  ${tpopmassnber}
`
