import gql from 'graphql-tag'

import { ap } from '../../../../shared/fragments'

export default gql`
  query apByIdForDelete($id: UUID!) {
    apById(id: $id) {
      ...ApFields
    }
  }
  ${ap}
`
