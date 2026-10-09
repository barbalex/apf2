import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { beob } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query beobByIdQueryForBeob($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
