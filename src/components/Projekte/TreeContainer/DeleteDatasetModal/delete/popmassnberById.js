import gql from 'graphql-tag'

import { popmassnber } from '../../../../shared/fragments'

export default gql`
  query popmassnberByIdForDelete($id: UUID!) {
    popmassnberById(id: $id) {
      ...PopmassnberFields
    }
  }
  ${popmassnber}
`
