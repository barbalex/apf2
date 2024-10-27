import { gql } from '@apollo/client'

import { tpopkontr } from '../../components/shared/fragments.js'

export const queryTpopKontrById = gql`
  query copyEkToQueryForEk2($id: UUID!) {
    tpopkontrById(id: $id) {
      ...TpopkontrFields
    }
  }
  ${tpopkontr}
`
