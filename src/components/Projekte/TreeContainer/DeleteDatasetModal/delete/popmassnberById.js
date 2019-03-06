import gql from 'graphql-tag'

import { popmassnber } from '../../../../shared/fragments'

export default gql`
  query popmassnberById($id: UUID!) {
    popmassnberById(id: $id) {
      ...PopmassnberFields
    }
  }
  ${popmassnber}
`
