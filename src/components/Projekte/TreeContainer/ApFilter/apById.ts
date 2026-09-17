import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ap } from '../../../shared/fragments.ts'

export const apById = dynamicGql`
  query apByIdQueryForApFilter($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
