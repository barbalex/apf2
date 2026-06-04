import { gql } from '@apollo/client'

import { erfkrit } from '../../../shared/fragments.ts'

export const query = gql`
  query erfkritByIdQuery($id: UUID!) {
    erfkritById(id: $id) {
      ...ErfkritFields
    }
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${erfkrit}
`
