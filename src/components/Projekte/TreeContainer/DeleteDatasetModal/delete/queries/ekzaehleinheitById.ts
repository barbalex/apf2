import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { ekzaehleinheit } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query ekzaehleinheitByIdForDelete($id: UUID!) {
    ekzaehleinheitById(id: $id) {
      ...EkzaehleinheitFields
    }
  }
  ${ekzaehleinheit}
`
