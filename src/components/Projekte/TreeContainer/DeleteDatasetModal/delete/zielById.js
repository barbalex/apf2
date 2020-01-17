import gql from 'graphql-tag'

import { ziel } from '../../../../shared/fragments'

export default gql`
  query zielByIdForDelete($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
  }
  ${ziel}
`
