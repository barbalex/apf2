import { gql } from '@apollo/client'

import { assozart } from '../../../../../shared/fragments.js'

export default gql`
  query assozartByIdForDelete($id: UUID!) {
    assozartById(id: $id) {
      ...AssozartFields
    }
  }
  ${assozart}
`
