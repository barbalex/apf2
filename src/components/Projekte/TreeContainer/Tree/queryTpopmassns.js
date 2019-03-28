import gql from 'graphql-tag'

import { tpopmassn, tpopmassnTypWerte } from '../../../shared/fragments'

export default gql`
  query TpopmassnQuery($isTpop: Boolean!, $tpopmassnFilter: TpopmassnFilter!) {
    allTpopmassns(filter: $tpopmassnFilter, orderBy: JAHR_ASC)
      @include(if: $isTpop) {
      nodes {
        ...TpopmassnFields
        pflanzanordnung
        tpopmassnTypWerteByTyp {
          ...TpopmassnTypWerteFields
        }
      }
    }
  }
  ${tpopmassn}
  ${tpopmassnTypWerte}
`
