import gql from 'graphql-tag'

import { tpopber } from '../../../shared/fragments'

export default gql`
  query TpopbersQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopbers(filter: { tpopId: { in: $tpop } }, orderBy: JAHR_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopberFields
      }
    }
  }
  ${tpopber}
`
