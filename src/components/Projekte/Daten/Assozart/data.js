import gql from 'graphql-tag'

import { assozart } from '../../../shared/fragments'

export default gql`
  query assozartByIdQuery($id: UUID!) {
    assozartById(id: $id) {
      ...AssozartFields
      aeEigenschaftenByAeId {
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
  ${assozart}
`
