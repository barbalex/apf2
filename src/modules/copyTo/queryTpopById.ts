import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpop } from '../../components/shared/fragments.ts'

export const queryTpopById = dynamicGql`
  query copyTpopToQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
