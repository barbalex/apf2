import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../components/shared/fragments'

export default gql`
  query copyEkZaehlToQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
