import gql from 'graphql-tag'

import { tpopkontrzaehlEinheitWerte } from '../../../shared/fragments'

export default gql`
  query TpopkontrzaehlEinheitWertesDataQuery(
    $isWerteListen: Boolean!
    $filter: TpopkontrzaehlEinheitWerteFilter!
  ) {
    unfiltered: allTpopkontrzaehlEinheitWertes {
      totalCount
    }
    allTpopkontrzaehlEinheitWertes(filter: $filter, orderBy: SORT_ASC)
      @include(if: $isWerteListen) {
      totalCount
      nodes {
        ...TpopkontrzaehlEinheitWerteFields
      }
    }
  }
  ${tpopkontrzaehlEinheitWerte}
`
