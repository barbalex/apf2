import { gql } from '@apollo/client'

import { ziel } from '../../../../shared/fragments.js'

export default gql`
  query zielFolderOpenLowerNodesQuery($id: UUID!) {
    apById(id: $id) {
      id
      zielsByApId {
        nodes {
          ...ZielFields
          zielbersByZielId {
            nodes {
              id
            }
          }
        }
      }
    }
  }
  ${ziel}
`
