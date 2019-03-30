import gql from 'graphql-tag'

import { apart } from '../../../shared/fragments'

export default gql`
  query apartByIdQuery($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
    }
  }
  ${apart}
`
