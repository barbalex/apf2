import gql from 'graphql-tag'

import { tpopfreiwkontr } from '../../../shared/fragments'

export default gql`
  query TpopfreiwkontrsQuery(
    $isTpop: Boolean!
    $tpopfreiwkontrFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(filter: $tpopfreiwkontrFilter, orderBy: JAHR_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopfreiwkontrFields
      }
    }
  }
  ${tpopfreiwkontr}
`
