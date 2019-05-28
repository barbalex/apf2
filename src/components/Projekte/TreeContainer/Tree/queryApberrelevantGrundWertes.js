import gql from 'graphql-tag'

import { tpopApberrelevantGrundWerte } from '../../../shared/fragments'

export default gql`
  query ApberrelevantGrundWertesDataQuery(
    $isWerteListen: Boolean!
    $filter: TpopApberrelevantGrundWerteFilter!
  ) {
    unfiltered: allTpopApberrelevantGrundWertes {
      totalCount
    }
    allTpopApberrelevantGrundWertes(filter: $filter, orderBy: SORT_ASC)
      @include(if: $isWerteListen) {
      totalCount
      nodes {
        ...TpopApberrelevantGrundWerteFields
      }
    }
  }
  ${tpopApberrelevantGrundWerte}
`
