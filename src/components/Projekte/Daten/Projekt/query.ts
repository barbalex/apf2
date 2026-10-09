import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { projekt } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query projektByIdQuery($id: UUID!) {
    projektById(id: $id) {
      ...ProjektFields
    }
  }
  ${projekt}
`
