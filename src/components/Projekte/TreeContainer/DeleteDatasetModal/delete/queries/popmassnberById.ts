import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { popmassnber } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query popmassnberByIdForDelete($id: UUID!) {
    popmassnberById(id: $id) {
      ...PopmassnberFields
    }
  }
  ${popmassnber}
`
