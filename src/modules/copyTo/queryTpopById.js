import { gql } from '@apollo/client'

import { tpop } from '../../components/shared/fragments.js'

export default gql`
  query copyTpopToQuery($id: UUID!) {
    tpopById(id: $id) {
      ...TpopFields
    }
  }
  ${tpop}
`
