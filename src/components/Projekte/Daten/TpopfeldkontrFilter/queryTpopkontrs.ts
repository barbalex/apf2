import { graphql } from '../../../../gql'

export const queryTpopkontrs = graphql(`
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
`)
