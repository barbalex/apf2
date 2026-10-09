import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { ziel } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query zielByIdForDelete($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
  }
  ${ziel}
`
