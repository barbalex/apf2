import { gql as dynamicGql } from '../../../../../apolloGql.ts'

import { ziel } from '../../../../shared/fragments.ts'

export const query = dynamicGql`
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
