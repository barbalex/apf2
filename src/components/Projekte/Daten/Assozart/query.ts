import { gql as dynamicGql } from '../../../../apolloGql.ts'

import { assozart } from '../../../shared/fragments.ts'

export const query = dynamicGql`
  query assozartByIdQuery($id: UUID!) {
    assozartById(id: $id) {
      ...AssozartFields
      aeTaxonomyByAeId {
        id
        taxArtName
      }
      apByApId {
        artId
        assozartsByApId {
          nodes {
            ...AssozartFields
          }
        }
      }
    }
  }
  ${assozart}
`
