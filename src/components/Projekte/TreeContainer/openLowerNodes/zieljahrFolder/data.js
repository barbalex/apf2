import gql from 'graphql-tag'

import { ziel } from '../../../../shared/fragments'

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
