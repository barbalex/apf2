import gql from 'graphql-tag'

import { apart } from '../../../../shared/fragments'

export default gql`
  query apartById($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
    }
  }
  ${apart}
`
