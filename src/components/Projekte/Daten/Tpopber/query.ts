import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { tpopber } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query tpopberByIdQuery($id: UUID!) {
    tpopberById(id: $id) {
      ...TpopberFields
    }
    allTpopEntwicklungWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${tpopber}
`
