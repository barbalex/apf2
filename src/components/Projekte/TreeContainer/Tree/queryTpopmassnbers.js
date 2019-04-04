import gql from 'graphql-tag'

import { tpopmassnber } from '../../../shared/fragments'

export default gql`
  query TpopmassnbersQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopmassnbers(filter: { tpopId: { in: $tpop } }, orderBy: LABEL_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnberFields
      }
    }
  }
  ${tpopmassnber}
`
