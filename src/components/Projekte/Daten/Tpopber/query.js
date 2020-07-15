import { gql } from '@apollo/client'

import { tpopber } from '../../../shared/fragments'

export default gql`
  query tpopberByIdQuery($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
  }
  ${tpopber}
`
