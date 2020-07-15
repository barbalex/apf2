import { gql } from '@apollo/client'

import { beob } from '../../components/shared/fragments'

export default gql`
  query copyBeobZugeordnetKoordToTpopQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
