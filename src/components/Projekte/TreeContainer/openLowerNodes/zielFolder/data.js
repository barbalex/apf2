import gql from 'graphql-tag'

import { ziel } from '../../../../shared/fragments'

export default gql`
  query Query($id: UUID!) {
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
