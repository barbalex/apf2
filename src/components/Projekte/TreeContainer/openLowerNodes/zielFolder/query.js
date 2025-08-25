import { gql } from '@apollo/client'

import { ziel } from '../../../../shared/fragments.js'

export const query = gql`
  query zielFolderOpenLowerNodesQuery($id: UUID!) {
    apById(id: $id) {
      id
      zielsByApId {
        nodes {
          ...ZielFields
        }
      }
    }
  }
  ${ziel}
`
