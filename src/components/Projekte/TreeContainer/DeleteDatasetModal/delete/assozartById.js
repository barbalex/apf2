import gql from 'graphql-tag'

import { assozart } from '../../../../shared/fragments'

export default gql`
  query assozartByIdForDelete($id: UUID!) {
    assozartById(id: $id) {
      ...AssozartFields
    }
  }
  ${assozart}
`
