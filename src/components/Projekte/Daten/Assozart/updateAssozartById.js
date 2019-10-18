import gql from 'graphql-tag'

import { assozart } from '../../../shared/fragments'

export default gql`
  mutation updateAssozart(
    $id: UUID!
    $bemerkungen: String
    $aeId: UUID
    $apId: UUID
    $changedBy: String
  ) {
    updateAssozartById(
      input: {
        id: $id
        assozartPatch: {
          id: $id
          bemerkungen: $bemerkungen
          aeId: $aeId
          apId: $apId
          changedBy: $changedBy
        }
      }
    ) {
      assozart {
        ...AssozartFields
        aeTaxonomyByAeId {
          id
          artname
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
  }
  ${assozart}
`
