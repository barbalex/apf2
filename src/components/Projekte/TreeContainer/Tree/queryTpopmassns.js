import gql from 'graphql-tag'

import { tpopmassn } from '../../../shared/fragments'

export default gql`
  query TpopmassnQuery($isTpop: Boolean!, $tpopmassnFilter: TpopmassnFilter!) {
    allTpopmassns(filter: $tpopmassnFilter, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnFields
      }
    }
  }
  ${tpopmassn}
`
