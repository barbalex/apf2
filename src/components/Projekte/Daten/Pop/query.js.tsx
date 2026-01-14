import { gql } from '@apollo/client'

import { pop } from '../../../shared/fragments.ts'

export const query = gql`
  query popByIdForPopFormQuery($id: UUID!) {
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
