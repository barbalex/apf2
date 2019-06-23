import gql from 'graphql-tag'

import {
  ekzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
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
