import gql from 'graphql-tag'

import { ekAbrechnungstypWerte } from '../../../shared/fragments'

export default gql`
  query EkAbrechnungstypWertesDataQuery(
    $isWerteListen: Boolean!
    $filter: EkAbrechnungstypWerteFilter!
  ) {
    unfiltered: allEkAbrechnungstypWertes {
      totalCount
    }
    allEkAbrechnungstypWertes(filter: $filter, orderBy: SORT_ASC)
      @include(if: $isWerteListen) {
      totalCount
      nodes {
        ...EkAbrechnungstypWerteFields
      }
    }
  }
  ${ekAbrechnungstypWerte}
`
