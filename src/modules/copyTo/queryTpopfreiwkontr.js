import gql from 'graphql-tag'

import { tpopkontrTypWerte } from '../../components/shared/fragments'

export default gql`
  query Query($tpop: UUID!) {
    allTpopkontrs(
      filter: {
        typ: { equalTo: "Freiwilligen-Erfolgskontrolle" }
        tpopId: { equalTo: $tpop }
      }
    ) {
      nodes {
        id
        tpopId
        datum
        jahr
        tpopkontrTypWerteByTyp {
          ...TpopkontrTypWerteFields
        }
      }
    }
  }
  ${tpopkontrTypWerte}
`
