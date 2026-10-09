import { gql as dynamicGql } from '../../../../../../apolloGql.ts'

import {
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
} from '../../../../../shared/fragments.ts'

export const query = dynamicGql`
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
