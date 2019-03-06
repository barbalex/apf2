import gql from 'graphql-tag'

import { tpopfeldkontr, tpopkontrTypWerte } from '../../../shared/fragments'

export default gql`
  query TpopfeldkontrsQuery($tpop: [UUID!], $isTpop: Boolean!) {
    allTpopkontrs(
      filter: {
        or: [
          { typ: { notEqualTo: "Freiwilligen-Erfolgskontrolle" } }
          { typ: { isNull: true } }
        ]
        tpopId: { in: $tpop }
      }
    ) @include(if: $isTpop) {
      nodes {
        ...TpopfeldkontrFields
        tpopkontrTypWerteByTyp {
          ...TpopkontrTypWerteFields
        }
      }
    }
  }
  ${tpopfeldkontr}
  ${tpopkontrTypWerte}
`
