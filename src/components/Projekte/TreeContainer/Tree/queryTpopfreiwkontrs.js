import gql from 'graphql-tag'

import { tpopfreiwkontr, tpopkontrTypWerte } from '../../../shared/fragments'

export default gql`
  query TpopfreiwkontrsQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopkontrs(
      filter: {
        typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
        tpopId: { in: $tpop }
      }
      orderBy: JAHR_ASC
    ) @include(if: $isTpop) {
      nodes {
        ...TpopfreiwkontrFields
        tpopkontrTypWerteByTyp {
          ...TpopkontrTypWerteFields
        }
      }
    }
  }
  ${tpopfreiwkontr}
  ${tpopkontrTypWerte}
`
