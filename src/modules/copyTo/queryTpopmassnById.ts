import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopmassn } from '../../components/shared/fragments.ts'

export const queryTpopmassnById = dynamicGql`
  query copyTpopmassnToQuery($id: UUID!) {
    tpopmassnById(id: $id) {
      ...TpopmassnFields
    }
  }
  ${tpopmassn}
`
