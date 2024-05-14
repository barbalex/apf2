import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../components/shared/fragments.js'

export default gql`
  query copyEkZaehlToQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
