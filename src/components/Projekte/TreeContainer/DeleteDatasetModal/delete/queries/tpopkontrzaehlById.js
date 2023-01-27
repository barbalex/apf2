import { gql } from '@apollo/client'

import { tpopkontrzaehl } from '../../../../../shared/fragments'

export default gql`
  query tpopkontrzaehlByIdForDelete($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
    }
  }
  ${tpopkontrzaehl}
`
