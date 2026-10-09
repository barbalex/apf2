import { gql as dynamicGql } from '../../../../apolloGql.ts'

import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments.ts'

export const query = dynamicGql`
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
