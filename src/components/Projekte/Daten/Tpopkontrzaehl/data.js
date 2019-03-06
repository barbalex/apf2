import gql from 'graphql-tag'

import { tpopkontrzaehl } from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlQuery($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
      tpopkontrzaehlEinheitWerteByEinheit {
        id
        text
      }
      tpopkontrzaehlMethodeWerteByMethode {
        id
        text
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
        id
        code
        text
        sort
      }
    }
  }
  ${tpopkontrzaehl}
`
