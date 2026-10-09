import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import { apberuebersicht } from '../../../../../shared/fragments.ts'

export default dynamicGql`
  query apberuebersichtByIdForDelete($id: UUID!) {
    apberuebersichtById(id: $id) {
      ...ApberuebersichtFields
    }
  }
  ${apberuebersicht}
`
