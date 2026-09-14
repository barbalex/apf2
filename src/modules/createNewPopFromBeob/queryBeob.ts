import { gql as dynamicGql } from '../../apolloGql.ts'

import { beob } from '../../components/shared/fragments.ts'

export const queryBeob = dynamicGql`
  query createNewPopFromBeobQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
