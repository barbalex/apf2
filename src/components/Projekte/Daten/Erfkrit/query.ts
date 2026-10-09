import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { erfkrit } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
