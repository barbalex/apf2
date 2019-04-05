import gql from 'graphql-tag'

import { tpopfreiwkontr } from '../../../shared/fragments'

export default gql`
  query TpopfreiwkontrsQuery($isTpop: Boolean!, $filter: TpopkontrFilter!) {
    allTpopkontrs(filter: $filter, orderBy: JAHR_ASC) @include(if: $isTpop) {
      nodes {
        ...TpopfreiwkontrFields
      }
    }
  }
  ${tpopfreiwkontr}
`
