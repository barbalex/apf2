import { gql } from '@apollo/client'

import { pop } from '../../../shared/fragments.js'

export const query = gql`
  query popByIdQuery($id: UUID!) {
    popById(id: $id) {
      ...PopFields
      apByApId {
        id
        startJahr
      }
    }
  }
  ${pop}
`