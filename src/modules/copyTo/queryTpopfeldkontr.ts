import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopkontrTypWerte } from '../../components/shared/fragments.ts'

export default dynamicGql`
  query copyEkToQueryForEk1($tpop: UUID!) {
    allTpopkontrs(
      filter: {
        typ: { notEqualTo: "Freiwilligen-Kontrolle" }
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
