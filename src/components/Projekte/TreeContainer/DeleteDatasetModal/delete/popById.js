import gql from 'graphql-tag'

import { pop } from '../../../../shared/fragments'

export default gql`
  query popByIdForDelete($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
