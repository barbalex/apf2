import { gql as dynamicGql } from '../../apolloGql.ts'

import { beob } from '../../components/shared/fragments.ts'

export const queryBeob = dynamicGql`
  query copyBeobZugeordnetKoordToTpopQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
