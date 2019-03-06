import gql from 'graphql-tag'

import { pop } from '../../../../shared/fragments'

export default gql`
  query popById($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
