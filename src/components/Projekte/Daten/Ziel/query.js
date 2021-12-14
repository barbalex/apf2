import { gql } from '@apollo/client'

import { ziel } from '../../../shared/fragments'

export default gql`
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
