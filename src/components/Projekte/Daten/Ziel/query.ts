import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { ziel } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query zielByIdQueryForZiel($id: UUID!) {
    zielById(id: $id) {
      ...ZielFields
    }
    allZielTypWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${ziel}
`
