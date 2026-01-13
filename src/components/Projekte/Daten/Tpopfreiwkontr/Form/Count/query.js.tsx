import { gql } from '@apollo/client'

import {
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
} from '../../../../../shared/fragments.js'

export const query = gql`
  query TpopkontrzaehlQueryForCount($id: UUID!) {
    tpopkontrzaehlById(id: $id) {
      ...TpopkontrzaehlFields
      tpopkontrzaehlEinheitWerteByEinheit {
        ...TpopkontrzaehlEinheitWerteFields
      }
    }
    allTpopkontrzaehlEinheitWertes {
      nodes {
        ...TpopkontrzaehlEinheitWerteFields
      }
    }
  }
  ${tpopkontrzaehl}
  ${tpopkontrzaehlEinheitWerte}
`
