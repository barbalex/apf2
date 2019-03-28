import gql from 'graphql-tag'

import { tpopfeldkontr, tpopkontrTypWerte } from '../../../shared/fragments'

export default gql`
  query TpopfeldkontrsQuery(
    $isTpop: Boolean!
    $tpopfeldkontrFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(filter: $tpopfeldkontrFilter) @include(if: $isTpop) {
      nodes {
        ...TpopfeldkontrFields
        tpopkontrTypWerteByTyp {
          ...TpopkontrTypWerteFields
        }
      }
    }
  }
  ${tpopfeldkontr}
  ${tpopkontrTypWerte}
`
