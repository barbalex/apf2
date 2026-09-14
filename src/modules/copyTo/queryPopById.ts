import { gql as dynamicGql } from '../../apolloGql.ts'

import { pop } from '../../components/shared/fragments.ts'

export const queryPopById = dynamicGql`
  query copyPopToQuery($id: UUID!) {
    popById(id: $id) {
      ...PopFields
    }
  }
  ${pop}
`
