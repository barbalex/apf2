import { gql } from '@apollo/client'

import { ziel } from '../../../../shared/fragments.js'

export default gql`
  query zieljahrFoldercopyBeobKoordQuery($id: UUID!, $jahr: Int!) {
    apById(id: $id) {
      id
      zielsByApId(filter: { jahr: { equalTo: $jahr } }) {
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
