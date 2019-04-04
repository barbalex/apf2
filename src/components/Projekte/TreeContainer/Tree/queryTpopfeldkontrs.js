import gql from 'graphql-tag'

import { tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query TpopfeldkontrsQuery(
    $isTpop: Boolean!
    $tpopfeldkontrFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(filter: $tpopfeldkontrFilter, orderBy: LABEL_EK_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopfeldkontrFields
      }
    }
  }
  ${tpopfeldkontr}
`
