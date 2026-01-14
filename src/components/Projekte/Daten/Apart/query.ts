import { gql } from '@apollo/client'

import { apart } from '../../../shared/fragments.ts'

export const query = gql`
  query apartByIdQuery($id: UUID!) {
    apartById(id: $id) {
      ...ApartFields
      aeTaxonomyByArtId {
        id
        taxArtName
      }
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
