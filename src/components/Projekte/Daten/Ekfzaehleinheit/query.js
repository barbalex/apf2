import gql from 'graphql-tag'

import {
  ekfzaehleinheit,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  query ekfzaehleinheitByIdQuery($id: UUID!) {
    ekfzaehleinheitById(id: $id) {
      ...EkfzaehleinheitFields
      tpopkontrzaehlEinheitWerteByZaehleinheitId {
        ...TpopkontrzaehlEinheitWerteFields
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
  ${tpopkontrzaehlEinheitWerte}
`
