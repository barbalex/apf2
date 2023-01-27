import { gql } from '@apollo/client'

import { tpopmassn } from '../../../../../shared/fragments'

export default gql`
  query tpopmassnByIdForDelete($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
