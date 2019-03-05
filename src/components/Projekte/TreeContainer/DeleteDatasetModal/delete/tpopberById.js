import gql from 'graphql-tag'

import { tpopber } from '../../../../shared/fragments'

export default gql`
  query tpopberById($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
  }
  ${tpopber}
`
