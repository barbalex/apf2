import { gql } from '@apollo/client'

import { tpopkontrTypWerte } from '../../components/shared/fragments.ts'

export default gql`
  query copyEkfToQuery($tpop: UUID!) {
    allTpopkontrs(
      filter: {
        typ: { equalTo: "Freiwilligen-Kontrolle" }
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
