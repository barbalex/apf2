import gql from 'graphql-tag'

import { ekfzaehleinheit } from '../../../shared/fragments'

export default gql`
  query ekfzaehleinheitByIdQuery($id: UUID!) {
    ekfzaehleinheitById(id: $id) {
      ...EkfzaehleinheitFields
      tpopkontrzaehlEinheitWerteByZaehleinheitId {
        id
        text
      }
      apByApId {
        id
        ekfzaehleinheitsByApId {
          nodes {
            ...EkfzaehleinheitFields
          }
        }
      }
    }
  }
  ${ekfzaehleinheit}
`
