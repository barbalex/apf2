import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { apberuebersicht } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query apberuebersichtByIdQuery($id: UUID!) {
    apberuebersichtById(id: $id) {
      ...ApberuebersichtFields
    }
  }
  ${apberuebersicht}
`
