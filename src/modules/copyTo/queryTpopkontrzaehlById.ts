import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopkontrzaehl } from '../../components/shared/fragments.ts'

export const queryTpopkontrzaehlById = dynamicGql`
  query copyEkZaehlToQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
