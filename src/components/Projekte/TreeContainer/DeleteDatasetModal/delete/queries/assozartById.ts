import { gql } from '@apollo/client'

import { assozart } from '../../../../../shared/fragments.ts'

export default gql`
  query assozartByIdForDelete($id: UUID!) {
    assozartById(id: $id) {
      ...AssozartFields
    }
  }
  ${assozart}
`
