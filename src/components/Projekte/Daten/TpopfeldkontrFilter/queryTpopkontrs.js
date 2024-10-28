import { gql } from '@apollo/client'

export const queryTpopkontrs = gql`
  query tpopkontrQueryForEk(
    $filteredFilter: TpopkontrFilter!
    $allFilter: TpopkontrFilter!
  ) {
    allTpopkontrs(filter: $allFilter) {
      totalCount
    }
    tpopkontrsFiltered: allTpopkontrs(filter: $filteredFilter) {
      totalCount
    }
  }
`
