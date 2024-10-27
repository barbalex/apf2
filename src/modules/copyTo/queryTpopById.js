import { gql } from '@apollo/client'

import { tpop } from '../../components/shared/fragments.js'

export const queryTpopById = gql`
  query copyTpopToQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
