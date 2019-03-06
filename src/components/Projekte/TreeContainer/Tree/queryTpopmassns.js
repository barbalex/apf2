import gql from 'graphql-tag'

import { tpopmassn, tpopmassnTypWerte } from '../../../shared/fragments'

export default gql`
  query TpopmassnQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopmassns(filter: { tpopId: { in: $tpop } }, orderBy: JAHR_ASC)
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
