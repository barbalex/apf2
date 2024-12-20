import { gql } from '@apollo/client'

import { apber } from '../../../shared/fragments.js'

export const query = gql`
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
