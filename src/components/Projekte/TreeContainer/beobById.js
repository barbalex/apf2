import { gql } from '@apollo/client'

import { beob } from '../../shared/fragments.js'

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
