import gql from 'graphql-tag'

import { tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query TpopfeldkontrsQuery($isTpop: Boolean!, $filter: TpopkontrFilter!) {
    allTpopkontrs(filter: $filter, orderBy: [JAHR_ASC, DATUM_ASC])
      @include(if: $isTpop) {
      nodes {
        ...TpopfeldkontrFields
      }
    }
  }
  ${tpopfeldkontr}
`
