import { gql } from '@apollo/client'

import { tpopber } from '../../../shared/fragments.ts'

export const query = gql`
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
