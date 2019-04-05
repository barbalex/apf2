import gql from 'graphql-tag'

import { tpopmassn } from '../../../shared/fragments'

export default gql`
  query TpopmassnQuery($isTpop: Boolean!, $filter: TpopmassnFilter!) {
    allTpopmassns(filter: $filter, orderBy: LABEL_ASC) @include(if: $isTpop) {
      nodes {
        ...TpopmassnFields
      }
    }
  }
  ${tpopmassn}
`
