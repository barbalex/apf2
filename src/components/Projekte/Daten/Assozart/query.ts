import { gql } from '@apollo/client'

import { assozart } from '../../../shared/fragments.ts'

export const query = gql`
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
