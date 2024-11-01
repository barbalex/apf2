import { gql } from '@apollo/client'

import { beob } from '../../shared/fragments.js'

export const beobById = gql`
  query beobById($id: UUID!) {
    beobById(id: $id) {
      id
      lv95X
      lv95Y
    }
  }
  ${beob}
`
