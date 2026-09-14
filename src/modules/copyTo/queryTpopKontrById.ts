import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopkontr } from '../../components/shared/fragments.ts'

export const queryTpopKontrById = dynamicGql`
  query copyEkToQueryForEk2($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
