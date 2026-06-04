import { gql } from '@apollo/client'

import { tpopmassn } from '../../components/shared/fragments.ts'

export const queryTpopmassnById = gql`
  query copyTpopmassnToQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
