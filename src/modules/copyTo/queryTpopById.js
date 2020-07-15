import { gql } from '@apollo/client'

import { tpop } from '../../components/shared/fragments'

export default gql`
  query copyTpopToQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
