import gql from 'graphql-tag'

import { tpopmassnber } from '../../../shared/fragments'

export default gql`
  query TpopmassnbersQuery($filter: TpopmassnberFilter!, $isTpop: Boolean!) {
    allTpopmassnbers(filter: $filter, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnberFields
      }
    }
  }
  ${tpopmassnber}
`
