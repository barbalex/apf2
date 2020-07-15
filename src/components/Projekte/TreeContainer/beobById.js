import { gql } from '@apollo/client'

import { beob } from '../../shared/fragments'

export default gql`
  query beobById($id: UUID!) {
    beobById(id: $id) {
      id
      lv95X
      lv95Y
    }
  }
  ${beob}
`
