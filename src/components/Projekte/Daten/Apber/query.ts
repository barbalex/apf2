import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { apber } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query apberByIdQuery($id: UUID!) {
    apberById(id: $id) {
      ...ApberFields
    }
    allAdresses(orderBy: NAME_ASC) {
      nodes {
        value: id
        label: name
      }
    }
    allApErfkritWertes(orderBy: SORT_ASC) {
      nodes {
        value: code
        label: text
      }
    }
  }
  ${apber}
`
