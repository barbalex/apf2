import gql from 'graphql-tag'

import { ziel } from '../../../../shared/fragments'

export default gql`
  query zielById($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
  }
  ${ziel}
`
