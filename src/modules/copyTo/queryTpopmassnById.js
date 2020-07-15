import { gql } from '@apollo/client'

import { tpopmassn } from '../../components/shared/fragments'

export default gql`
  query copyTpopmassnToQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
