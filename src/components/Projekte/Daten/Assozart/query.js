import { gql } from '@apollo/client'

import { assozart } from '../../../shared/fragments'

export default gql`
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
