import { gql } from '@apollo/client'

import { beob } from '../../components/shared/fragments.ts'

export const queryBeob = gql`
  query createNewPopFromBeobQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
