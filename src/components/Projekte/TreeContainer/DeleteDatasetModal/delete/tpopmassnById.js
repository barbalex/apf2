import gql from 'graphql-tag'

import { tpopmassn } from '../../../../shared/fragments'

export default gql`
  query tpopmassnById($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
