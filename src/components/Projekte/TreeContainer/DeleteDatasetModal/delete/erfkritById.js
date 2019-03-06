import gql from 'graphql-tag'

import { erfkrit } from '../../../../shared/fragments'

export default gql`
  query erfkritById($id: UUID!) {
    erfkritById(id: $id) {
      ...ErfkritFields
    }
  }
  ${erfkrit}
`
