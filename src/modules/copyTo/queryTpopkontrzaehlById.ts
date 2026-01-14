import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../components/shared/fragments.ts'

export const queryTpopkontrzaehlById = gql`
  query copyEkZaehlToQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
