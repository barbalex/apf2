import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { pop } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
