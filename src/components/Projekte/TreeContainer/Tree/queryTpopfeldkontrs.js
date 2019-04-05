import gql from 'graphql-tag'

import { tpopfeldkontr } from '../../../shared/fragments'

export default gql`
  query TpopfeldkontrsQuery($isTpop: Boolean!, $filter: TpopkontrFilter!) {
    allTpopkontrs(filter: $filter, orderBy: LABEL_EK_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopfeldkontrFields
      }
    }
  }
  ${tpopfeldkontr}
`
