import { gql } from '@apollo/client'

import { apart } from '../../../shared/fragments'

export default gql`
  query apartByIdQuery($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
      apByApId {
        id
        apartsByApId {
          nodes {
            ...ApartFields
          }
        }
      }
    }
  }
  ${apart}
`
