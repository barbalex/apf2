import gql from 'graphql-tag'

import { tpopber } from '../../../shared/fragments'

export default gql`
  query TpopbersQuery($filter: TpopberFilter!, $isTpop: Boolean!) {
    allTpopbers(filter: $filter, orderBy: LABEL_ASC) @include(if: $isTpop) {
      nodes {
        ...TpopberFields
      }
    }
  }
  ${tpopber}
`
