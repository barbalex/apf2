import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { apart } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query apartByIdForDelete($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
    }
  }
  ${apart}
`
