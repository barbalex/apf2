import gql from 'graphql-tag'

import {
  tpopkontrzaehl,
  tpopkontrzaehlEinheitWerte,
} from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlsQuery($tpopkontr: [UUID!], $isTpopkontr: Boolean!) {
    allTpopkontrzaehls(filter: { tpopkontrId: { in: $tpopkontr } })
      @include(if: $isTpopkontr) {
      nodes {
        ...TpopkontrzaehlFields
        tpopkontrzaehlEinheitWerteByEinheit {
          ...TpopkontrzaehlEinheitWerteFields
        }
        tpopkontrzaehlMethodeWerteByMethode {
          id
          text
        }
      }
    }
  }
  ${tpopkontrzaehl}
  ${tpopkontrzaehlEinheitWerte}
`
