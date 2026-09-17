import { gql as dynamicGql } from '../../../../../apolloGql.ts'

import { ziel } from '../../../../shared/fragments.ts'

export const query = dynamicGql`
  query zieljahrFoldercopyBeobKoordQuery($id: UUID!, $jahr: Int!) {
    apById(id: $id) {
      id
      zielsByApId(filter: { jahr: { equalTo: $jahr } }) {
        nodes {
          ...ZielFields
        }
      }
    }
  }
  ${ziel}
`
