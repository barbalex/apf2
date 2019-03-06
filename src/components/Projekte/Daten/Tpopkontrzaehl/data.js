import gql from 'graphql-tag'

import {
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
  tpopkontrzaehlMethodeWerte,
} from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
      tpopkontrzaehlEinheitWerteByEinheit {
        ...TpopkontrzaehlEinheitWerteFields
      }
      tpopkontrzaehlMethodeWerteByMethode {
        ...TpopkontrzaehlMethodeWerteFields
      }
      tpopkontrByTpopkontrId {
        tpopByTpopId {
          id
          popByPopId {
            id
            apId
          }
        }
      }
    }
    allTpopkontrzaehlMethodeWertes {
      nodes {
        ...TpopkontrzaehlMethodeWerteFields
      }
    }
  }
  ${tpopkontrzaehl}
  ${tpopkontrzaehlEinheitWerte}
  ${tpopkontrzaehlMethodeWerte}
`
