import { gql } from '@apollo/client'

import { beob } from '../../components/shared/fragments.js'

export default gql`
  query copyBeobZugeordnetKoordToTpopQuery($id: UUID!) {
    beobById(id: $id) {
      ...BeobFields
    }
  }
  ${beob}
`
