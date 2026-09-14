import { gql as dynamicGql } from '../../apolloGql.ts'

import { tpopkontrTypWerte } from '../../components/shared/fragments.ts'

export default dynamicGql`
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
