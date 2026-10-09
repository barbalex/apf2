import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { pop } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query popByIdForDelete($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
