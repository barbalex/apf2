import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { apart } from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
