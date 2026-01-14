import { gql } from '@apollo/client'

import { ziel } from '../../../../shared/fragments.ts'

export const query = gql`
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
