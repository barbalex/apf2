import { gql } from '@apollo/client'

import {
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
} from '../../../../shared/fragments'

export default gql`
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
