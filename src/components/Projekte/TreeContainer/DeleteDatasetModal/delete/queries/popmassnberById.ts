import { gql } from '@apollo/client'

import { popmassnber } from '../../../../../shared/fragments.js'

export default gql`
  query popmassnberByIdForDelete($id: UUID!) {
    popmassnberById(id: $id) {
      ...PopmassnberFields
    }
  }
  ${popmassnber}
`
