import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { beob } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query beobByIdForDelete($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
