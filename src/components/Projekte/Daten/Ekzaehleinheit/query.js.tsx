import { gql } from '@apollo/client'

import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments.js'

export const query = gql`
  query ekzaehleinheitByIdQuery($id: UUID!) {
    ekzaehleinheitById(id: $id) {
      ...EkzaehleinheitFields
      tpopkontrzaehlEinheitWerteByZaehleinheitId {
        ...TpopkontrzaehlEinheitWerteFields
      }
      apByApId {
        id
        ekzaehleinheitsByApId {
          nodes {
            ...EkzaehleinheitFields
          }
        }
      }
    }
  }
  ${ekzaehleinheit}
  ${tpopkontrzaehlEinheitWerte}
`
